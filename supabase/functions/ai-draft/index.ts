// ai-draft: generates post drafts for one client with Claude and inserts them
// as content_items with status 'draft' and ai_generated = true.
//
// The AI line: this function only ever creates DRAFTS. Theo curates them and
// sends the good ones to 'awaiting_approval'; the client approves copy and
// timing in the portal; only approved items get scheduled in Metricool.
// Nothing AI-written can reach a social network without two humans saying yes.
//
// Secrets:
//   ANTHROPIC_API_KEY  - Theo's Claude API key (console.anthropic.com). Until
//                        it is set this function returns a clear "not connected
//                        yet" message, so the button can ship before the key.
// Optional:
//   ANTHROPIC_MODEL    - defaults to claude-opus-5
//
// Invoked from the app (owner role only) via supabase.functions.invoke('ai-draft',
// { body: { client_id, count?, instructions? } }).

import { createClient } from 'npm:@supabase/supabase-js@2'
import Anthropic from 'npm:@anthropic-ai/sdk@0.65.0'

type Draft = {
  platform: string
  content_type: string
  title: string
  copy_text: string
  suggested_time_iso: string
  suggested_photo?: string | null
  rationale: string
}

const PLATFORMS = ['instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'youtube', 'pinterest', 'threads', 'google_business']
const CONTENT_TYPES = ['post', 'reel', 'story', 'carousel', 'video', 'article', 'live']

function parseDrafts(text: string): Draft[] {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  const start = cleaned.indexOf('[')
  const end = cleaned.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('No JSON array in model output')
  const parsed = JSON.parse(cleaned.slice(start, end + 1))
  if (!Array.isArray(parsed)) throw new Error('Model output is not an array')
  return parsed.filter(
    (d): d is Draft =>
      d && typeof d.title === 'string' && typeof d.copy_text === 'string' && PLATFORMS.includes(d.platform),
  )
}

Deno.serve(async (req) => {
  const headers = { 'Content-Type': 'application/json' }

  // Only Theo (owner/assistant) may generate drafts
  const authHeader = req.headers.get('Authorization') ?? ''
  const userClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: userData } = await userClient.auth.getUser()
  if (!userData?.user) {
    return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401, headers })
  }

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single()
  if (!profile || !['owner', 'assistant'].includes(profile.role)) {
    return new Response(JSON.stringify({ error: 'Only the studio owner can generate drafts' }), { status: 403, headers })
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "Claude isn't connected yet. Add the ANTHROPIC_API_KEY secret in Supabase (Edge Functions → Secrets) using Theo's own Claude account key, then try again.",
      }),
      { status: 400, headers },
    )
  }

  const { client_id, count = 4, instructions = '' } = await req.json().catch(() => ({}))
  if (!client_id) {
    return new Response(JSON.stringify({ error: 'client_id is required' }), { status: 400, headers })
  }

  const { data: client, error: clientError } = await admin
    .from('clients')
    .select('id, name, website, tagline, brand_voice, target_audience, content_pillars, default_hashtags, brand_colors, social_accounts(platform, handle)')
    .eq('id', client_id)
    .single()
  if (clientError || !client) {
    return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404, headers })
  }

  const { data: recent } = await admin
    .from('content_items')
    .select('title, platform, status')
    .eq('client_id', client_id)
    .order('created_at', { ascending: false })
    .limit(20)

  // Photos/videos the client has uploaded to their content library
  const { data: library } = await admin
    .from('assets')
    .select('file_name, caption, kind')
    .eq('client_id', client_id)
    .in('kind', ['photo', 'video'])
    .order('created_at', { ascending: false })
    .limit(15)

  const platforms = (client.social_accounts ?? []).map((a: { platform: string }) => a.platform)
  const activePlatforms = platforms.length > 0 ? platforms : ['instagram', 'facebook']

  const anthropic = new Anthropic({ apiKey })
  const model = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-opus-5'

  const brief = `You are the content strategist for a UK social media management studio.
Draft ${count} social media post ideas for this client. Spread them across their platforms and across the next 7 days, at times that suit each platform's UK audience.

CLIENT
- Name: ${client.name}
- Tagline: ${client.tagline ?? 'n/a'}
- Website: ${client.website ?? 'n/a'}
- Brand voice: ${client.brand_voice ?? 'friendly, professional, plain English'}
- Brand colours: ${client.brand_colors ? JSON.stringify(client.brand_colors) : 'not chosen yet'}
- Target audience: ${client.target_audience ?? 'UK consumers'}
- Content pillars: ${client.content_pillars ?? 'behind the scenes, tips, social proof, offers'}
- House hashtags: ${client.default_hashtags ?? 'none'}
- Platforms: ${activePlatforms.join(', ')}

This is a very small business that is new to social media — write like a helpful local
expert, never corporate. Introduce-the-business and meet-the-owner angles work well early on.

PHOTOS/VIDEOS IN THEIR LIBRARY (pick a real one per post where it fits):
${(library ?? []).map((a: { file_name: string; caption: string | null; kind: string }) => `- [${a.kind}] ${a.file_name}${a.caption ? ` — ${a.caption}` : ''}`).join('\n') || '- none uploaded yet (suggest what they should photograph instead)'}

RECENTLY PLANNED (avoid repeating these angles):
${(recent ?? []).map((r: { title: string; platform: string }) => `- [${r.platform}] ${r.title}`).join('\n') || '- none yet'}

${instructions ? `EXTRA INSTRUCTIONS FROM THE STUDIO:\n${instructions}\n` : ''}
Reply with ONLY a JSON array. Each element:
{
  "platform": one of ${JSON.stringify(activePlatforms)},
  "content_type": one of ${JSON.stringify(CONTENT_TYPES)},
  "title": short working title,
  "copy_text": the full ready-to-post caption in the brand voice, with hashtags where they fit the platform,
  "suggested_time_iso": ISO 8601 datetime within the next 7 days (Europe/London),
  "suggested_photo": exact file name from their library that fits this post, or null,
  "rationale": one sentence on why this post and this timing
}`

  let drafts: Draft[]
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4000,
      messages: [{ role: 'user', content: brief }],
    })
    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => ('text' in b ? b.text : ''))
      .join('\n')
    drafts = parseDrafts(text)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return new Response(JSON.stringify({ error: `Claude request failed: ${message}` }), { status: 502, headers })
  }

  if (drafts.length === 0) {
    return new Response(JSON.stringify({ error: 'Claude returned no usable drafts — try again' }), { status: 502, headers })
  }

  const rows = drafts.map((d) => ({
    client_id,
    title: d.title,
    copy_text: d.copy_text,
    platform: d.platform,
    content_type: CONTENT_TYPES.includes(d.content_type) ? d.content_type : 'post',
    status: 'draft',
    scheduled_at: d.suggested_time_iso ? new Date(d.suggested_time_iso).toISOString() : null,
    ai_generated: true,
    ai_model: model,
    notes: [d.rationale, d.suggested_photo ? `Photo: ${d.suggested_photo}` : null].filter(Boolean).join(' · ') || null,
  }))

  const { error: insertError } = await admin.from('content_items').insert(rows)
  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500, headers })
  }

  return new Response(JSON.stringify({ ok: true, created: rows.length, model }), { headers })
})

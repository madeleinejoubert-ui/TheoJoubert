// brand-kit: returns one client's brand kit as JSON, keyed by their share token.
// Built for the Base44 app to spin up sample webpages in the client's branding.
//
//   GET /functions/v1/brand-kit?token=<clients.share_token>
//   Headers: apikey: <project anon key>  (Supabase gateway requirement)
//
// Response: business name/tagline/website, colour scheme, logo + up to 6 sample
// photos as 7-day signed URLs, social handles, and active service packages.
// The share token is unguessable (uuid) and read-only — rotating it in the
// clients table revokes access.

import { createClient } from 'npm:@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Content-Type': 'application/json',
}

const SIGNED_URL_TTL = 60 * 60 * 24 * 7 // 7 days

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const token = new URL(req.url).searchParams.get('token')
  if (!token) {
    return new Response(JSON.stringify({ error: 'token query parameter is required' }), { status: 400, headers: CORS })
  }

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const { data: client } = await admin
    .from('clients')
    .select('id, name, tagline, website, color_scheme, brand_colors, logo_path, social_accounts(platform, handle, profile_url)')
    .eq('share_token', token)
    .single()
  if (!client) {
    return new Response(JSON.stringify({ error: 'Unknown token' }), { status: 404, headers: CORS })
  }

  let logo_url: string | null = null
  if (client.logo_path) {
    const { data } = await admin.storage.from('client-assets').createSignedUrl(client.logo_path, SIGNED_URL_TTL)
    logo_url = data?.signedUrl ?? null
  }

  const { data: photos } = await admin
    .from('assets')
    .select('storage_path, caption')
    .eq('client_id', client.id)
    .eq('kind', 'photo')
    .order('created_at', { ascending: false })
    .limit(6)

  const sample_images: { url: string; caption: string | null }[] = []
  for (const p of photos ?? []) {
    const { data } = await admin.storage.from('client-assets').createSignedUrl(p.storage_path, SIGNED_URL_TTL)
    if (data?.signedUrl) sample_images.push({ url: data.signedUrl, caption: p.caption })
  }

  const { data: services } = await admin
    .from('services')
    .select('name, description, price_monthly, price_oneoff')
    .eq('active', true)
    .order('sort_order')

  return new Response(
    JSON.stringify({
      business: {
        name: client.name,
        tagline: client.tagline,
        website: client.website,
      },
      color_scheme: client.color_scheme,
      colors: client.brand_colors,
      logo_url,
      sample_images,
      social: (client.social_accounts ?? []).map((a: { platform: string; handle: string; profile_url: string | null }) => ({
        platform: a.platform,
        handle: a.handle,
        url: a.profile_url,
      })),
      studio_services: services ?? [],
      note: 'Image URLs are signed and expire after 7 days — re-fetch this endpoint for fresh ones.',
    }),
    { headers: CORS },
  )
})

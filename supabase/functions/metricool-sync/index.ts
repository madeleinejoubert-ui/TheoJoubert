// metricool-sync: pulls the last 30 days of per-network metrics from the
// Metricool API for every client with a metricool_blog_id and upserts one
// analytics_snapshots row per client+platform.
//
// Secrets required (Supabase dashboard -> Edge Functions -> Secrets):
//   METRICOOL_USER_TOKEN  - Metricool account token (Settings -> API in Metricool)
//   METRICOOL_USER_ID     - Metricool userId
// Optional:
//   SYNC_SECRET           - if set, requests must send it in an x-sync-secret header
//
// Scheduled daily via pg_cron (see migration 20260902141000_schedule_metricool_sync.sql).

import { createClient } from 'npm:@supabase/supabase-js@2'

const METRICOOL_BASE = 'https://app.metricool.com/api'

// Our platform names -> Metricool network names
const NETWORK_MAP: Record<string, string> = {
  instagram: 'instagram',
  facebook: 'facebook',
  tiktok: 'tiktok',
  linkedin: 'linkedin',
  x: 'twitter',
  youtube: 'youtube',
  pinterest: 'pinterest',
  google_business: 'gmb',
}

type MetricPlan = {
  metric: string
  subject?: string
  agg: 'sum' | 'last'
  field: 'followers' | 'net_follower_change' | 'impressions' | 'reach' | 'engagements' | 'link_clicks' | 'posts_published'
}

// Metric names per network, from the Metricool API docs (/v2/analytics/timelines)
const PLANS: Record<string, MetricPlan[]> = {
  instagram: [
    { metric: 'delta_followers', subject: 'account', agg: 'sum', field: 'net_follower_change' },
    { metric: 'postsCount', subject: 'account', agg: 'sum', field: 'posts_published' },
    { metric: 'postsInteractions', subject: 'account', agg: 'sum', field: 'engagements' },
    { metric: 'impressions', subject: 'posts', agg: 'sum', field: 'impressions' },
    { metric: 'reach', subject: 'posts', agg: 'sum', field: 'reach' },
  ],
  facebook: [
    { metric: 'pageFollows', agg: 'last', field: 'followers' },
    { metric: 'pageImpressions', agg: 'sum', field: 'impressions' },
    { metric: 'postsInteractions', agg: 'sum', field: 'engagements' },
    { metric: 'postsCount', agg: 'sum', field: 'posts_published' },
  ],
  tiktok: [
    { metric: 'followers_count', agg: 'last', field: 'followers' },
    { metric: 'followers_delta_count', agg: 'sum', field: 'net_follower_change' },
    { metric: 'video_views', agg: 'sum', field: 'impressions' },
    { metric: 'likes', agg: 'sum', field: 'engagements' },
  ],
  linkedin: [
    { metric: 'followers', agg: 'last', field: 'followers' },
    { metric: 'deltaFollowers', agg: 'sum', field: 'net_follower_change' },
    { metric: 'impressionCount', agg: 'sum', field: 'impressions' },
    { metric: 'clickCount', agg: 'sum', field: 'link_clicks' },
    { metric: 'postsCount', agg: 'sum', field: 'posts_published' },
  ],
  twitter: [
    { metric: 'followers', agg: 'last', field: 'followers' },
    { metric: 'postsCount', agg: 'sum', field: 'posts_published' },
    { metric: 'impressions', subject: 'posts', agg: 'sum', field: 'impressions' },
    { metric: 'interactions', subject: 'posts', agg: 'sum', field: 'engagements' },
  ],
  youtube: [
    { metric: 'views', agg: 'sum', field: 'impressions' },
    { metric: 'interactions', agg: 'sum', field: 'engagements' },
  ],
  pinterest: [
    { metric: 'followers', agg: 'last', field: 'followers' },
    { metric: 'impression', agg: 'sum', field: 'impressions' },
    { metric: 'pin_click', agg: 'sum', field: 'link_clicks' },
  ],
  gmb: [
    { metric: 'business_impressions_total', agg: 'sum', field: 'impressions' },
    { metric: 'clicks_total', agg: 'sum', field: 'link_clicks' },
  ],
}

// Timeline responses vary in shape; accept [{date,value}], [[date,value]] and {data:[...]}
function seriesValues(json: unknown): number[] {
  const arr = Array.isArray(json)
    ? json
    : (json as { data?: unknown[]; values?: unknown[] })?.data ??
      (json as { values?: unknown[] })?.values ??
      []
  const out: number[] = []
  for (const item of arr as unknown[]) {
    let v: unknown
    if (Array.isArray(item) && item.length >= 2) v = item[1]
    else if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>
      v = o.value ?? o.count ?? (Array.isArray(o.values) ? o.values[0] : undefined)
    }
    const n = Number(v)
    if (Number.isFinite(n)) out.push(n)
  }
  return out
}

async function fetchMetric(
  blogId: string,
  network: string,
  plan: MetricPlan,
  from: string,
  to: string,
  auth: { token: string; userId: string },
): Promise<{ value: number | null; error?: string }> {
  const params = new URLSearchParams({
    userId: auth.userId,
    blogId,
    network,
    metric: plan.metric,
    from,
    to,
    timezone: 'Europe/London',
  })
  if (plan.subject) params.set('subject', plan.subject)
  const res = await fetch(`${METRICOOL_BASE}/v2/analytics/timelines?${params}`, {
    headers: { 'X-Mc-Auth': auth.token, Accept: 'application/json' },
  })
  if (!res.ok) return { value: null, error: `${plan.metric}: HTTP ${res.status}` }
  const values = seriesValues(await res.json())
  if (values.length === 0) return { value: null }
  const value = plan.agg === 'sum' ? values.reduce((a, b) => a + b, 0) : values[values.length - 1]
  return { value: Math.round(value) }
}

Deno.serve(async (req) => {
  const syncSecret = Deno.env.get('SYNC_SECRET')
  if (syncSecret && req.headers.get('x-sync-secret') !== syncSecret) {
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 })
  }

  const token = Deno.env.get('METRICOOL_USER_TOKEN')
  const userId = Deno.env.get('METRICOOL_USER_ID')
  if (!token || !userId) {
    return new Response(
      JSON.stringify({ error: 'METRICOOL_USER_TOKEN and METRICOOL_USER_ID secrets are not set' }),
      { status: 500 },
    )
  }
  const auth = { token, userId }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Last 30 full days, ending yesterday (today's numbers are still moving)
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  const start = new Date(end.getTime() - 30 * 24 * 3600 * 1000)
  const from = start.toISOString().slice(0, 19)
  const to = new Date(end.getTime() - 1000).toISOString().slice(0, 19)
  const periodStart = start.toISOString().slice(0, 10)
  const periodEnd = to.slice(0, 10)

  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('id, name, metricool_blog_id, social_accounts(platform, connected_in_metricool)')
    .not('metricool_blog_id', 'is', null)
  if (clientsError) {
    return new Response(JSON.stringify({ error: clientsError.message }), { status: 500 })
  }

  let snapshots = 0
  const problems: string[] = []

  for (const client of clients ?? []) {
    const platforms = (client.social_accounts ?? [])
      .filter((a: { connected_in_metricool: boolean }) => a.connected_in_metricool)
      .map((a: { platform: string }) => a.platform)
    if (platforms.length === 0) {
      problems.push(`${client.name}: no social accounts marked connected_in_metricool`)
      continue
    }

    for (const platform of platforms) {
      const network = NETWORK_MAP[platform]
      const plans = network ? PLANS[network] : undefined
      if (!plans) continue

      const row: Record<string, unknown> = {
        client_id: client.id,
        platform,
        period_start: periodStart,
        period_end: periodEnd,
        source: 'metricool',
      }
      const rawResults: Record<string, unknown> = {}
      const errors: string[] = []

      for (const plan of plans) {
        try {
          const { value, error } = await fetchMetric(client.metricool_blog_id, network, plan, from, to, auth)
          rawResults[plan.metric] = value
          if (error) errors.push(error)
          else if (value !== null) row[plan.field] = value
        } catch (e) {
          errors.push(`${plan.metric}: ${e instanceof Error ? e.message : String(e)}`)
        }
      }
      if (errors.length) rawResults._errors = errors
      row.raw = rawResults

      const { error: upsertError } = await supabase
        .from('analytics_snapshots')
        .upsert(row, { onConflict: 'client_id,platform,period_start,period_end' })
      if (upsertError) problems.push(`${client.name}/${platform}: ${upsertError.message}`)
      else snapshots++
    }
  }

  return new Response(
    JSON.stringify({ ok: true, period: { from: periodStart, to: periodEnd }, snapshots, problems }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

export default function ClientOverview({ clientId }) {
  const [clientName, setClientName] = useState('')
  const [snapshots, setSnapshots] = useState([])
  const [pendingCount, setPendingCount] = useState(0)
  const [upcoming, setUpcoming] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const [clientRes, snapsRes, pendingRes, upcomingRes] = await Promise.all([
        supabase.from('clients').select('name').eq('id', clientId).single(),
        supabase
          .from('analytics_snapshots')
          .select('*')
          .eq('client_id', clientId)
          .order('period_end', { ascending: false })
          .limit(24),
        supabase
          .from('content_items')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', clientId)
          .eq('status', 'awaiting_approval'),
        supabase
          .from('content_items')
          .select('title, platform, scheduled_at, status')
          .eq('client_id', clientId)
          .in('status', ['approved', 'scheduled'])
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at')
          .limit(8),
      ])
      if (clientRes.data) setClientName(clientRes.data.name)
      if (snapsRes.error) setError(snapsRes.error.message)
      else setSnapshots(snapsRes.data)
      setPendingCount(pendingRes.count ?? 0)
      if (upcomingRes.data) setUpcoming(upcomingRes.data)
    }
    load()
  }, [clientId])

  // Latest snapshot per platform
  const latestByPlatform = []
  const seen = new Set()
  for (const s of snapshots) {
    if (!seen.has(s.platform)) {
      seen.add(s.platform)
      latestByPlatform.push(s)
    }
  }

  const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('en-GB'))

  return (
    <div>
      <h1>{clientName ? `${clientName} — Overview` : 'Overview'}</h1>
      {pendingCount > 0 && (
        <div className="callout-info">
          <strong>{pendingCount} post{pendingCount === 1 ? '' : 's'}</strong> waiting for your
          approval — head to the Approvals tab.
        </div>
      )}
      {error && <p className="form-message">{error}</p>}

      <h2>Last 30 days, per platform</h2>
      {latestByPlatform.length === 0 ? (
        <div className="panel">
          <p className="muted" style={{ margin: 0 }}>
            No performance data yet. Numbers appear automatically once your accounts are
            connected in Metricool — the platform pulls them in every morning.
          </p>
        </div>
      ) : (
        <div className="stat-grid">
          {latestByPlatform.map((s) => (
            <div key={s.id} className="stat-card">
              <span className="stat-label">{s.platform.replaceAll('_', ' ')}</span>
              <span className="stat-value">{fmt(s.followers ?? s.impressions)}</span>
              <span className="stat-label">
                {s.followers != null ? 'followers' : 'impressions'}
                {s.net_follower_change != null && s.net_follower_change !== 0 && (
                  <> · {s.net_follower_change > 0 ? '+' : ''}{fmt(s.net_follower_change)} this month</>
                )}
              </span>
              <span className="stat-label">
                {s.engagements != null && <>{fmt(s.engagements)} engagements · </>}
                {s.posts_published != null && <>{fmt(s.posts_published)} posts</>}
              </span>
            </div>
          ))}
        </div>
      )}

      <h2>Coming up</h2>
      {upcoming.length === 0 ? (
        <p className="muted">Nothing scheduled yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>When</th><th>Post</th><th>Platform</th><th>Status</th></tr>
          </thead>
          <tbody>
            {upcoming.map((i, idx) => (
              <tr key={idx}>
                <td>{i.scheduled_at ? new Date(i.scheduled_at).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                <td>{i.title}</td>
                <td>{i.platform.replaceAll('_', ' ')}</td>
                <td><span className={`status-pill s-${i.status}`}>{i.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

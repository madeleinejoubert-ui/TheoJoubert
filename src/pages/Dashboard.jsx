import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const weekAhead = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
      const now = new Date().toISOString()
      const [clients, scheduled, leads, invoices] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase
          .from('content_items')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'scheduled')
          .gte('scheduled_at', now)
          .lte('scheduled_at', weekAhead),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('invoices').select('id', { count: 'exact', head: true }).in('status', ['sent', 'overdue']),
      ])
      const firstError = clients.error || scheduled.error || leads.error || invoices.error
      if (firstError) {
        setError(firstError.message)
        return
      }
      setStats({
        activeClients: clients.count ?? 0,
        scheduledThisWeek: scheduled.count ?? 0,
        newLeads: leads.count ?? 0,
        unpaidInvoices: invoices.count ?? 0,
      })
    }
    load()
  }, [])

  if (error) return <p className="form-message">Could not load stats: {error}</p>
  if (!stats) return <p className="muted">Loading…</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.activeClients}</span>
          <span className="stat-label">Active clients</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.scheduledThisWeek}</span>
          <span className="stat-label">Posts scheduled (next 7 days)</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.newLeads}</span>
          <span className="stat-label">New leads</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.unpaidInvoices}</span>
          <span className="stat-label">Invoices awaiting payment</span>
        </div>
      </div>
      <section className="panel">
        <h2>Daily flow</h2>
        <ol className="flow-list">
          <li>Check new leads and reply the same day.</li>
          <li>Schedule and approve content in Metricool; log each piece in the Content Calendar here.</li>
          <li>End of month: export the Metricool report per client and record the numbers under Analytics.</li>
          <li>Raise invoices on the 1st; chase anything unpaid after 14 days.</li>
        </ol>
      </section>
    </div>
  )
}

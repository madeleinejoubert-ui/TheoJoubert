import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const PLATFORMS = ['instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'youtube', 'pinterest', 'threads', 'google_business']
const STATUSES = ['idea', 'draft', 'awaiting_approval', 'approved', 'scheduled', 'published', 'cancelled']

export default function ContentCalendar() {
  const [items, setItems] = useState([])
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ client_id: '', title: '', platform: 'instagram', scheduled_at: '' })
  const [error, setError] = useState('')

  async function load() {
    const [itemsRes, clientsRes] = await Promise.all([
      supabase
        .from('content_items')
        .select('*, clients(name)')
        .order('scheduled_at', { ascending: true, nullsFirst: false })
        .limit(200),
      supabase.from('clients').select('id, name').order('name'),
    ])
    if (itemsRes.error) setError(itemsRes.error.message)
    else setItems(itemsRes.data)
    if (clientsRes.data) setClients(clientsRes.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function addItem(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.from('content_items').insert({
      client_id: form.client_id,
      title: form.title,
      platform: form.platform,
      scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
      status: form.scheduled_at ? 'scheduled' : 'idea',
    })
    if (error) setError(error.message)
    else {
      setForm({ client_id: form.client_id, title: '', platform: form.platform, scheduled_at: '' })
      load()
    }
  }

  async function setStatus(id, status) {
    const patch = { status }
    if (status === 'published') patch.published_at = new Date().toISOString()
    const { error } = await supabase.from('content_items').update(patch).eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <div>
      <h1>Content Calendar</h1>
      <p className="muted">Plan here, schedule in Metricool, then mark each piece published.</p>
      <form className="inline-form" onSubmit={addItem}>
        <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} required>
          <option value="">Client *</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input placeholder="Post title / idea *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} />
        <button className="btn-primary">Add</button>
      </form>
      {error && <p className="form-message">{error}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>When</th>
            <th>Client</th>
            <th>Title</th>
            <th>Platform</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.scheduled_at ? new Date(item.scheduled_at).toLocaleString('en-GB') : 'unscheduled'}</td>
              <td>{item.clients?.name || '—'}</td>
              <td>{item.title}</td>
              <td>{item.platform}</td>
              <td>
                <select value={item.status} onChange={(e) => setStatus(item.id, e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="muted">Nothing planned yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

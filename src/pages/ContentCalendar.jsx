import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const PLATFORMS = ['instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'youtube', 'pinterest', 'threads', 'google_business']
const STATUSES = ['idea', 'draft', 'awaiting_approval', 'changes_requested', 'approved', 'scheduled', 'published', 'cancelled']

export default function ContentCalendar() {
  const [items, setItems] = useState([])
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ client_id: '', title: '', platform: 'instagram', scheduled_at: '' })
  const [aiClient, setAiClient] = useState('')
  const [aiInstructions, setAiInstructions] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [expanded, setExpanded] = useState(null)
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

  async function generateDrafts() {
    if (!aiClient) {
      setAiMessage('Pick a client first.')
      return
    }
    setAiBusy(true)
    setAiMessage('Asking Claude for draft ideas…')
    const { data, error } = await supabase.functions.invoke('ai-draft', {
      body: { client_id: aiClient, count: 4, instructions: aiInstructions },
    })
    if (error) {
      // supabase-js wraps non-2xx responses; surface the function's message when present
      let detail = error.message
      try {
        const body = await error.context?.json?.()
        if (body?.error) detail = body.error
      } catch { /* keep default message */ }
      setAiMessage(detail)
    } else {
      setAiMessage(`Created ${data.created} drafts with ${data.model}. Review them below, edit what needs editing, then set the keepers to "awaiting approval".`)
      load()
    }
    setAiBusy(false)
  }

  return (
    <div>
      <h1>Content Calendar</h1>
      <div className="ai-line">
        <span className="ai-step">AI drafts</span>
        <span className="ai-arrow">→</span>
        <span className="ai-step human">Theo curates</span>
        <span className="ai-arrow">→</span>
        <span className="ai-step human">Client approves</span>
        <span className="ai-arrow">→</span>
        <span className="ai-step">Scheduled in Metricool</span>
      </div>

      <section className="panel ai-panel">
        <h2>✦ AI drafting</h2>
        <p className="muted">
          Claude drafts posts in the client's brand voice. Drafts land below as
          <em> draft</em> — nothing reaches a client, or a network, until you send it for approval.
        </p>
        <div className="inline-form" style={{ margin: 0 }}>
          <select value={aiClient} onChange={(e) => setAiClient(e.target.value)}>
            <option value="">Client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            placeholder="Optional steer (e.g. 'push the January offer')"
            value={aiInstructions}
            onChange={(e) => setAiInstructions(e.target.value)}
            style={{ minWidth: 260 }}
          />
          <button className="btn-primary" onClick={generateDrafts} disabled={aiBusy}>
            {aiBusy ? 'Drafting…' : 'Generate 4 drafts'}
          </button>
        </div>
        {aiMessage && <p className="muted" style={{ marginBottom: 0 }}>{aiMessage}</p>}
      </section>

      <h2>Add manually</h2>
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
            <>
              <tr key={item.id} onClick={() => setExpanded(expanded === item.id ? null : item.id)} style={{ cursor: 'pointer' }}>
                <td>{item.scheduled_at ? new Date(item.scheduled_at).toLocaleString('en-GB') : 'unscheduled'}</td>
                <td>{item.clients?.name || '—'}</td>
                <td>
                  {item.ai_generated && <span className="chip ai" title={item.ai_model || 'AI-drafted'}>✦</span>}{' '}
                  {item.title}
                  {item.status === 'changes_requested' && item.client_feedback && (
                    <div className="feedback-note">Client: “{item.client_feedback}”</div>
                  )}
                </td>
                <td>{item.platform}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select value={item.status} onChange={(e) => setStatus(item.id, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>
                    ))}
                  </select>
                </td>
              </tr>
              {expanded === item.id && item.copy_text && (
                <tr key={`${item.id}-copy`}>
                  <td colSpan={5} className="copy-row">
                    <strong>Copy:</strong> {item.copy_text}
                    {item.notes && <div className="muted">Rationale: {item.notes}</div>}
                  </td>
                </tr>
              )}
            </>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="muted">Nothing planned yet — try the AI drafting panel above.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const STATUSES = ['lead', 'proposal', 'active', 'paused', 'ended']

export default function Clients() {
  const emptyForm = {
    name: '', contact_name: '', email: '', monthly_fee: '',
    metricool_blog_id: '', brand_voice: '', content_pillars: '',
  }
  const [clients, setClients] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setClients(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function addClient(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.from('clients').insert({
      name: form.name,
      contact_name: form.contact_name || null,
      email: form.email || null,
      monthly_fee: form.monthly_fee ? Number(form.monthly_fee) : null,
      metricool_blog_id: form.metricool_blog_id || null,
      brand_voice: form.brand_voice || null,
      content_pillars: form.content_pillars || null,
    })
    if (error) setError(error.message)
    else {
      setForm(emptyForm)
      load()
    }
  }

  async function setStatus(id, status) {
    const { error } = await supabase.from('clients').update({ status }).eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <div>
      <h1>Clients</h1>
      <form className="inline-form" onSubmit={addClient}>
        <input placeholder="Business name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Contact name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Monthly fee £" type="number" step="0.01" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })} />
        <input placeholder="Metricool brand id" value={form.metricool_blog_id} onChange={(e) => setForm({ ...form, metricool_blog_id: e.target.value })} />
        <input placeholder="Brand voice (for AI drafts)" value={form.brand_voice} onChange={(e) => setForm({ ...form, brand_voice: e.target.value })} style={{ minWidth: 220 }} />
        <input placeholder="Content pillars, comma separated" value={form.content_pillars} onChange={(e) => setForm({ ...form, content_pillars: e.target.value })} style={{ minWidth: 220 }} />
        <button className="btn-primary">Add client</button>
      </form>
      <p className="muted">
        The client's email doubles as their portal login — when they sign up with it, they
        get the client portal automatically. Metricool brand id + connected accounts turn on
        the nightly analytics sync.
      </p>
      {error && <p className="form-message">{error}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Business</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Monthly fee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.contact_name || '—'}</td>
              <td>{c.email || '—'}</td>
              <td>{c.monthly_fee != null ? `£${Number(c.monthly_fee).toFixed(2)}` : '—'}</td>
              <td>
                <select value={c.status} onChange={(e) => setStatus(c.id, e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan={5} className="muted">No clients yet — add the first one above.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

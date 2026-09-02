import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const STATUSES = ['lead', 'proposal', 'active', 'paused', 'ended']

export default function Clients() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ name: '', contact_name: '', email: '', monthly_fee: '' })
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
    })
    if (error) setError(error.message)
    else {
      setForm({ name: '', contact_name: '', email: '', monthly_fee: '' })
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
        <button className="btn-primary">Add client</button>
      </form>
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

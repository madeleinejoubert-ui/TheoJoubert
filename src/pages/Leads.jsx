import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed']

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setLeads(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function setStatus(id, status) {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <div>
      <h1>Leads</h1>
      <p className="muted">Enquiries land here from the website contact form (the form posts to the public leads table).</p>
      {error && <p className="form-message">{error}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Message</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>{new Date(l.created_at).toLocaleDateString('en-GB')}</td>
              <td>{l.name}</td>
              <td>{l.email}</td>
              <td>{l.company || '—'}</td>
              <td className="wrap">{l.message || '—'}</td>
              <td>
                <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={6} className="muted">No leads yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

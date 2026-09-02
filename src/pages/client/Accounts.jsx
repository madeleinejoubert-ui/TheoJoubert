import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

const PLATFORMS = ['instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'youtube', 'pinterest', 'threads', 'google_business']

export default function ClientAccounts({ clientId }) {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ platform: 'instagram', handle: '', profile_url: '' })
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at')
    if (error) setError(error.message)
    else setAccounts(data)
  }

  useEffect(() => {
    load()
  }, [clientId])

  async function addAccount(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.from('social_accounts').insert({
      client_id: clientId,
      platform: form.platform,
      handle: form.handle,
      profile_url: form.profile_url || null,
    })
    if (error) setError(error.message)
    else {
      setForm({ platform: form.platform, handle: '', profile_url: '' })
      load()
    }
  }

  async function remove(id) {
    const { error } = await supabase.from('social_accounts').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <div>
      <h1>My Accounts</h1>
      <p className="muted">
        Add the social profiles you want managed. Theo connects each one in Metricool —
        once connected, its performance shows up on your Overview.
      </p>
      <form className="inline-form" onSubmit={addAccount}>
        <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p.replaceAll('_', ' ')}</option>
          ))}
        </select>
        <input placeholder="@handle or page name *" value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} required />
        <input placeholder="Profile URL (optional)" value={form.profile_url} onChange={(e) => setForm({ ...form, profile_url: e.target.value })} />
        <button className="btn-primary">Add account</button>
      </form>
      {error && <p className="form-message">{error}</p>}
      <table className="data-table">
        <thead>
          <tr><th>Platform</th><th>Handle</th><th>Metricool</th><th></th></tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id}>
              <td>{a.platform.replaceAll('_', ' ')}</td>
              <td>{a.profile_url ? <a href={a.profile_url} target="_blank" rel="noopener noreferrer">{a.handle}</a> : a.handle}</td>
              <td>
                {a.connected_in_metricool
                  ? <span className="status-pill s-approved">connected</span>
                  : <span className="status-pill s-draft">waiting for Theo</span>}
              </td>
              <td><button className="btn-ghost" onClick={() => remove(a.id)}>Remove</button></td>
            </tr>
          ))}
          {accounts.length === 0 && (
            <tr><td colSpan={4} className="muted">No accounts yet — add your first one above.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { COLOR_ROLES } from '../lib/palettes.js'

const KIND_ICON = { photo: '🖼️', video: '🎬', document: '📄', logo: '⭐', other: '📎' }

export default function OwnerLibrary() {
  const [clients, setClients] = useState([])
  const [selected, setSelected] = useState('')
  const [client, setClient] = useState(null)
  const [assets, setAssets] = useState([])
  const [urls, setUrls] = useState({})
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('clients').select('id, name').order('name').then(({ data }) => {
      if (data) {
        setClients(data)
        if (data.length > 0) setSelected(data[0].id)
      }
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    async function load() {
      const [clientRes, assetsRes] = await Promise.all([
        supabase
          .from('clients')
          .select('id, name, tagline, color_scheme, brand_colors, logo_path, share_token')
          .eq('id', selected)
          .single(),
        supabase
          .from('assets')
          .select('*')
          .eq('client_id', selected)
          .order('created_at', { ascending: false }),
      ])
      if (clientRes.error) setError(clientRes.error.message)
      else setClient(clientRes.data)
      if (assetsRes.data) {
        setAssets(assetsRes.data)
        const imagePaths = assetsRes.data
          .filter((a) => a.mime_type?.startsWith('image/'))
          .map((a) => a.storage_path)
        if (imagePaths.length > 0) {
          const { data: signed } = await supabase.storage
            .from('client-assets')
            .createSignedUrls(imagePaths, 3600)
          const map = {}
          signed?.forEach((s) => {
            if (s.signedUrl) map[s.path] = s.signedUrl
          })
          setUrls(map)
        } else {
          setUrls({})
        }
      }
    }
    load()
  }, [selected])

  const brandKitUrl = client
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/brand-kit?token=${client.share_token}`
    : ''

  async function copyKitUrl() {
    try {
      await navigator.clipboard.writeText(brandKitUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy — select and copy the URL manually.')
    }
  }

  async function openFile(asset) {
    const { data } = await supabase.storage.from('client-assets').createSignedUrl(asset.storage_path, 600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener')
  }

  return (
    <div>
      <h1>Brand &amp; Library</h1>
      <p className="muted">Everything each client has given us: colours, logo, tagline, photos and documents.</p>
      <div className="inline-form" style={{ marginTop: 6 }}>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {error && <p className="form-message">{error}</p>}

      {client && (
        <section className="panel" style={{ marginBottom: 22 }}>
          <h2 style={{ marginTop: 0 }}>{client.name} — brand kit</h2>
          {client.brand_colors ? (
            <div className="tune-row" style={{ marginBottom: 10 }}>
              {COLOR_ROLES.map((r) => (
                <div key={r.key} className="tune-item">
                  <span className="swatch large" style={{ background: client.brand_colors[r.key] }} />
                  <span>{r.label}</span>
                  <code>{client.brand_colors[r.key]}</code>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No colours chosen yet — nudge them towards the Brand Kit page.</p>
          )}
          {client.tagline && <p>“{client.tagline}”</p>}
          <p className="muted" style={{ marginBottom: 6 }}>
            <strong>Base44 sample webpage feed</strong> — this URL returns the brand kit as JSON
            (colours, logo, tagline, handles, sample photos). Paste it into the Base44 app to
            spin up a sample site in their branding (send the project's anon key as the
            <code> apikey</code> header):
          </p>
          <div className="kit-url-row">
            <code className="kit-url">{brandKitUrl}</code>
            <button className="btn-ghost" onClick={copyKitUrl}>{copied ? 'Copied ✓' : 'Copy'}</button>
          </div>
        </section>
      )}

      <div className="asset-grid">
        {assets.map((a) => (
          <div key={a.id} className="asset-card">
            {a.mime_type?.startsWith('image/') && urls[a.storage_path] ? (
              <img src={urls[a.storage_path]} alt={a.caption || a.file_name} loading="lazy" />
            ) : (
              <div className="asset-icon">{KIND_ICON[a.kind] || '📎'}</div>
            )}
            <div className="asset-meta">
              <span className="asset-name" title={a.file_name}>{a.file_name}</span>
              {a.caption && <span className="asset-caption">{a.caption}</span>}
              <span className="asset-actions">
                <button className="btn-ghost" onClick={() => openFile(a)}>Open</button>
              </span>
            </div>
          </div>
        ))}
        {assets.length === 0 && <p className="muted">No uploads from this client yet.</p>}
      </div>
    </div>
  )
}

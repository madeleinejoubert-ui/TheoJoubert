import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { PALETTES, COLOR_ROLES } from '../../lib/palettes.js'

export default function ClientBrandKit({ clientId }) {
  const [tagline, setTagline] = useState('')
  const [scheme, setScheme] = useState('')
  const [colors, setColors] = useState(null)
  const [logoPath, setLogoPath] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('clients')
        .select('tagline, color_scheme, brand_colors, logo_path')
        .eq('id', clientId)
        .single()
      if (error) {
        setError(error.message)
        return
      }
      setTagline(data.tagline ?? '')
      setScheme(data.color_scheme ?? '')
      setColors(data.brand_colors ?? null)
      setLogoPath(data.logo_path ?? null)
      if (data.logo_path) {
        const { data: signed } = await supabase.storage
          .from('client-assets')
          .createSignedUrl(data.logo_path, 3600)
        if (signed) setLogoUrl(signed.signedUrl)
      }
    }
    load()
  }, [clientId])

  function pickPalette(p) {
    setScheme(p.id)
    setColors({ ...p.colors })
    setMessage('')
  }

  function setColor(key, value) {
    setColors((c) => ({ ...(c ?? {}), [key]: value }))
  }

  async function uploadLogo(file) {
    if (!file) return
    setBusy(true)
    setError('')
    const path = `${clientId}/logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const { error: upError } = await supabase.storage.from('client-assets').upload(path, file)
    if (upError) {
      setError(upError.message)
      setBusy(false)
      return
    }
    await supabase.from('assets').insert({
      client_id: clientId,
      kind: 'logo',
      storage_path: path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    })
    setLogoPath(path)
    const { data: signed } = await supabase.storage.from('client-assets').createSignedUrl(path, 3600)
    if (signed) setLogoUrl(signed.signedUrl)
    setBusy(false)
  }

  async function save() {
    setBusy(true)
    setError('')
    setMessage('')
    const { error } = await supabase.rpc('save_brand_kit', {
      p_tagline: tagline || null,
      p_color_scheme: scheme || null,
      p_brand_colors: colors,
      p_logo_path: logoPath,
    })
    if (error) setError(error.message)
    else setMessage('Saved. Theo (and the AI drafts) will use this from now on.')
    setBusy(false)
  }

  return (
    <div>
      <h1>Brand Kit</h1>
      <p className="muted">
        New to all this? Perfect — this takes five minutes and it's the foundation of
        everything we post for you. Pick the colour scheme that feels most like your
        business, add your logo if you have one (no logo yet is fine), and give us one
        line on what you do.
      </p>
      {error && <p className="form-message">{error}</p>}

      <h2>1 · Pick your colours</h2>
      <div className="palette-grid">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`palette-card ${scheme === p.id ? 'selected' : ''}`}
            onClick={() => pickPalette(p)}
          >
            <span className="swatch-row">
              {Object.values(p.colors).map((c) => (
                <span key={c} className="swatch" style={{ background: c }} />
              ))}
            </span>
            <strong>{p.name}</strong>
            <small>{p.vibe}</small>
          </button>
        ))}
      </div>

      {colors && (
        <>
          <h2>2 · Fine-tune (optional)</h2>
          <div className="tune-row">
            {COLOR_ROLES.map((r) => (
              <label key={r.key} className="tune-item">
                <input
                  type="color"
                  value={colors[r.key] ?? '#888888'}
                  onChange={(e) => setColor(r.key, e.target.value)}
                />
                <span>{r.label}</span>
                <code>{colors[r.key]}</code>
              </label>
            ))}
          </div>
        </>
      )}

      <h2>3 · Logo &amp; tagline</h2>
      <div className="logo-row">
        {logoUrl ? (
          <img src={logoUrl} alt="Your logo" className="logo-preview" />
        ) : (
          <div className="logo-placeholder">No logo yet — that's OK</div>
        )}
        <label className="btn-primary file-btn">
          {logoPath ? 'Replace logo' : 'Upload logo'}
          <input type="file" accept="image/*" hidden onChange={(e) => uploadLogo(e.target.files?.[0])} />
        </label>
      </div>
      <label className="field-label">
        One line about your business (we'll use it in bios and posts)
        <input
          className="wide-input"
          placeholder="e.g. Home-baked celebration cakes, delivered across Kent"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          maxLength={140}
        />
      </label>

      <div style={{ marginTop: 18 }}>
        <button className="btn-primary" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save brand kit'}
        </button>
        {message && <p className="muted">{message}</p>}
      </div>
    </div>
  )
}

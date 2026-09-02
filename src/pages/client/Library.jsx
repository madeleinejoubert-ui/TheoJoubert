import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

function kindForMime(type) {
  if (!type) return 'other'
  if (type.startsWith('image/')) return 'photo'
  if (type.startsWith('video/')) return 'video'
  return 'document'
}

const KIND_ICON = { photo: '🖼️', video: '🎬', document: '📄', logo: '⭐', other: '📎' }

export default function ClientLibrary({ clientId }) {
  const [assets, setAssets] = useState([])
  const [urls, setUrls] = useState({})
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
      return
    }
    setAssets(data)
    const imagePaths = data.filter((a) => a.mime_type?.startsWith('image/')).map((a) => a.storage_path)
    if (imagePaths.length > 0) {
      const { data: signed } = await supabase.storage.from('client-assets').createSignedUrls(imagePaths, 3600)
      if (signed) {
        const map = {}
        signed.forEach((s) => {
          if (s.signedUrl) map[s.path] = s.signedUrl
        })
        setUrls(map)
      }
    }
  }

  useEffect(() => {
    load()
  }, [clientId])

  async function upload(files) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError('')
    for (const file of Array.from(files)) {
      const path = `${clientId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const { error: upError } = await supabase.storage.from('client-assets').upload(path, file)
      if (upError) {
        setError(`${file.name}: ${upError.message}`)
        continue
      }
      await supabase.from('assets').insert({
        client_id: clientId,
        kind: kindForMime(file.type),
        storage_path: path,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        caption: caption || null,
      })
    }
    setCaption('')
    setBusy(false)
    load()
  }

  async function remove(asset) {
    setError('')
    await supabase.storage.from('client-assets').remove([asset.storage_path])
    const { error } = await supabase.from('assets').delete().eq('id', asset.id)
    if (error) setError(error.message)
    else load()
  }

  async function openFile(asset) {
    const { data } = await supabase.storage.from('client-assets').createSignedUrl(asset.storage_path, 600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener')
  }

  return (
    <div>
      <h1>Content Library</h1>
      <p className="muted">
        The more you give us, the better your posts look. Phone photos are perfect —
        your workspace, your products, you at work, happy customers (with their OK),
        before-and-afters. Menus, price lists and flyers help too.
      </p>
      <div className="upload-box">
        <label className="btn-primary file-btn">
          {busy ? 'Uploading…' : 'Upload photos / videos / documents'}
          <input type="file" multiple hidden onChange={(e) => upload(e.target.files)} disabled={busy} />
        </label>
        <input
          placeholder="Optional note for these files (e.g. 'new spring menu')"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ flex: 1, minWidth: 240 }}
        />
      </div>
      {error && <p className="form-message">{error}</p>}

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
                <button className="btn-ghost" onClick={() => remove(a)}>Delete</button>
              </span>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <p className="muted">Nothing here yet — start with 5–10 photos from your phone.</p>
        )}
      </div>
    </div>
  )
}

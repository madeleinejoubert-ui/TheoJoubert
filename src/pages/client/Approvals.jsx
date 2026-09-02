import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'

const PLATFORM_LABELS = {
  instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', linkedin: 'LinkedIn',
  x: 'X', youtube: 'YouTube', pinterest: 'Pinterest', threads: 'Threads', google_business: 'Google Business',
}

function AiLine() {
  return (
    <div className="ai-line">
      <span className="ai-step">AI drafts</span>
      <span className="ai-arrow">→</span>
      <span className="ai-step">Theo curates</span>
      <span className="ai-arrow">→</span>
      <span className="ai-step human">You approve</span>
      <span className="ai-arrow">→</span>
      <span className="ai-step">Scheduled in Metricool</span>
    </div>
  )
}

export default function ClientApprovals({ clientId }) {
  const [queue, setQueue] = useState([])
  const [decided, setDecided] = useState([])
  const [feedback, setFeedback] = useState({})
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('client_id', clientId)
      .order('scheduled_at', { ascending: true, nullsFirst: false })
    if (error) {
      setError(error.message)
      return
    }
    setQueue(data.filter((i) => i.status === 'awaiting_approval'))
    setDecided(data.filter((i) => ['approved', 'scheduled', 'published', 'changes_requested'].includes(i.status)).slice(0, 12))
  }

  useEffect(() => {
    load()
  }, [clientId])

  async function decide(item, status) {
    const patch = { status }
    if (status === 'approved') {
      patch.approved_at = new Date().toISOString()
      const { data } = await supabase.auth.getUser()
      patch.approved_by = data?.user?.id ?? null
    }
    if (status === 'changes_requested') {
      patch.client_feedback = feedback[item.id] || null
    }
    const { error } = await supabase.from('content_items').update(patch).eq('id', item.id)
    if (error) setError(error.message)
    else {
      setFeedback((f) => ({ ...f, [item.id]: '' }))
      load()
    }
  }

  return (
    <div>
      <h1>Approvals</h1>
      <p className="muted">
        Nothing goes live without you. Review each post's copy and proposed time, then approve
        it or send it back with a note.
      </p>
      <AiLine />
      {error && <p className="form-message">{error}</p>}

      {queue.length === 0 && (
        <div className="panel">
          <p className="muted" style={{ margin: 0 }}>Nothing waiting for your approval right now. 🎉</p>
        </div>
      )}

      <div className="approval-list">
        {queue.map((item) => (
          <article key={item.id} className="approval-card">
            <header>
              <span className={`chip platform-${item.platform}`}>{PLATFORM_LABELS[item.platform] || item.platform}</span>
              <span className="chip type">{item.content_type}</span>
              {item.ai_generated && <span className="chip ai" title={`Drafted by AI (${item.ai_model || 'Claude'}), reviewed by Theo before reaching you`}>✦ AI-drafted · human-reviewed</span>}
            </header>
            <h3>{item.title}</h3>
            {item.copy_text && <p className="copy-preview">{item.copy_text}</p>}
            <p className="proposed-time">
              Proposed time:{' '}
              <strong>
                {item.scheduled_at
                  ? new Date(item.scheduled_at).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                  : 'to be agreed'}
              </strong>
            </p>
            <div className="approval-actions">
              <button className="btn-primary" onClick={() => decide(item, 'approved')}>
                Approve post &amp; time
              </button>
              <div className="changes-box">
                <input
                  placeholder="What should change? (copy, image, timing…)"
                  value={feedback[item.id] || ''}
                  onChange={(e) => setFeedback((f) => ({ ...f, [item.id]: e.target.value }))}
                />
                <button className="btn-ghost" onClick={() => decide(item, 'changes_requested')}>
                  Request changes
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {decided.length > 0 && (
        <section>
          <h2>Recent decisions</h2>
          <table className="data-table">
            <thead>
              <tr><th>Post</th><th>Platform</th><th>When</th><th>Status</th></tr>
            </thead>
            <tbody>
              {decided.map((i) => (
                <tr key={i.id}>
                  <td>{i.title}</td>
                  <td>{PLATFORM_LABELS[i.platform] || i.platform}</td>
                  <td>{i.scheduled_at ? new Date(i.scheduled_at).toLocaleDateString('en-GB') : '—'}</td>
                  <td><span className={`status-pill s-${i.status}`}>{i.status.replaceAll('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}

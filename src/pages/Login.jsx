import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    const fn =
      mode === 'signin'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })
    const { error } = await fn
    if (error) setMessage(error.message)
    else if (mode === 'signup') setMessage('Account created. Check your email to confirm, then sign in.')
    setBusy(false)
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <span className="brand-mark large">TS</span>
        <h1>Theo Social Studio</h1>
        <p className="muted">Client, content and analytics hub</p>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="current-password" />
        </label>
        <button className="btn-primary" disabled={busy}>
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
        {message && <p className="form-message">{message}</p>}
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? 'First time? Create an account' : 'Already registered? Sign in'}
        </button>
      </form>
    </div>
  )
}

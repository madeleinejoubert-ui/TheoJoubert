import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase.js'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Clients from './pages/Clients.jsx'
import ContentCalendar from './pages/ContentCalendar.jsx'
import Leads from './pages/Leads.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (loading) return <div className="page-loading">Loading…</div>
  if (!session) return <Login />

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">TS</span>
          <div>
            <strong>Theo Social Studio</strong>
            <small>Social media management</small>
          </div>
        </div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/clients">Clients</NavLink>
          <NavLink to="/calendar">Content Calendar</NavLink>
          <NavLink to="/leads">Leads</NavLink>
        </nav>
        <button className="btn-ghost signout" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/calendar" element={<ContentCalendar />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

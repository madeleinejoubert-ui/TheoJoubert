import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase.js'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Clients from './pages/Clients.jsx'
import ContentCalendar from './pages/ContentCalendar.jsx'
import Leads from './pages/Leads.jsx'
import OwnerLibrary from './pages/Library.jsx'
import ClientOverview from './pages/client/Overview.jsx'
import ClientApprovals from './pages/client/Approvals.jsx'
import ClientAccounts from './pages/client/Accounts.jsx'
import ClientBrandKit from './pages/client/BrandKit.jsx'
import ClientLibrary from './pages/client/Library.jsx'
import SiteLayout from './site/components/SiteLayout.jsx'
import SiteHome from './site/pages/Home.jsx'
import SiteAbout from './site/pages/About.jsx'
import SiteHowItWorks from './site/pages/HowItWorks.jsx'
import SiteServices from './site/pages/Services.jsx'
import SitePackages from './site/pages/Packages.jsx'
import SiteFAQ from './site/pages/FAQPage.jsx'
import SiteResults from './site/pages/Results.jsx'
import SiteFreeReview from './site/pages/FreeReview.jsx'

// Signed-out visitors see the Lantern Social marketing site (ported from the
// Base44 build); /login opens the studio console / client portal sign-in.
function PublicSite() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<SiteLayout />}>
        <Route path="/" element={<SiteHome />} />
        <Route path="/services" element={<SiteServices />} />
        <Route path="/packages" element={<SitePackages />} />
        <Route path="/how-it-works" element={<SiteHowItWorks />} />
        <Route path="/results" element={<SiteResults />} />
        <Route path="/about" element={<SiteAbout />} />
        <Route path="/faq" element={<SiteFAQ />} />
        <Route path="/free-review" element={<SiteFreeReview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function OwnerApp() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">LS</span>
          <div>
            <strong>Lantern Social</strong>
            <small>Studio console</small>
          </div>
        </div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/clients">Clients</NavLink>
          <NavLink to="/calendar">Content Calendar</NavLink>
          <NavLink to="/library">Brand &amp; Library</NavLink>
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
          <Route path="/library" element={<OwnerLibrary />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function ClientApp({ profile }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">LS</span>
          <div>
            <strong>Lantern Social</strong>
            <small>Client portal</small>
          </div>
        </div>
        <nav>
          <NavLink to="/" end>Overview</NavLink>
          <NavLink to="/approvals">Approvals</NavLink>
          <NavLink to="/brand">Brand Kit</NavLink>
          <NavLink to="/library">Content Library</NavLink>
          <NavLink to="/accounts">My Accounts</NavLink>
        </nav>
        <button className="btn-ghost signout" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<ClientOverview clientId={profile.client_id} />} />
          <Route path="/approvals" element={<ClientApprovals clientId={profile.client_id} />} />
          <Route path="/brand" element={<ClientBrandKit clientId={profile.client_id} />} />
          <Route path="/library" element={<ClientLibrary clientId={profile.client_id} />} />
          <Route path="/accounts" element={<ClientAccounts clientId={profile.client_id} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function PendingScreen() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <span className="brand-mark large">LS</span>
        <h1>Almost there</h1>
        <p className="muted">
          Your account exists but isn't linked to a client yet. Ask Theo to add your email
          address to your client record, then sign in again.
        </p>
        <button className="btn-ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        setProfile(null)
        setLoading(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    supabase
      .from('profiles')
      .select('role, client_id, full_name')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        setProfile(data)
        setLoading(false)
      })
  }, [session])

  if (loading) return <div className="page-loading">Loading…</div>
  if (!session) return <PublicSite />
  if (!profile) return <div className="page-loading">Loading…</div>

  if (profile.role === 'client' && profile.client_id) return <ClientApp profile={profile} />
  if (profile.role === 'owner' || profile.role === 'assistant') return <OwnerApp />
  return <PendingScreen />
}

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import StickyMobileCTA from './StickyMobileCTA.jsx'

export default function SiteLayout() {
  return (
    <div className="site-root min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-24 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  )
}

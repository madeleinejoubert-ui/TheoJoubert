import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Lamp } from 'lucide-react'
import { Button } from '../ui.jsx'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Packages', path: '/packages' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Results', path: '/results' },
  { label: 'About', path: '/about' },
  { label: 'FAQ', path: '/faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 glass-nav border-b border-amber-500/20 transition-all duration-300 ${scrolled ? 'shadow-[0_8px_30px_-12px_rgba(120,113,108,0.18)]' : ''}`}>
      <div className="container-narrow px-5 md:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg text-ink shrink-0">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_16px_rgba(245,158,11,0.55)]">
              <Lamp className="w-4 h-4 text-white" />
            </span>
            Lantern Social
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${location.pathname === l.path ? 'text-primary bg-primary/10' : 'text-foreground/70 hover:text-foreground hover:bg-muted'}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:block text-sm font-medium text-foreground/70 hover:text-foreground px-3">
              Client Login
            </Link>
            <Link to="/free-review">
              <Button className="btn-zest h-10 px-5 text-sm rounded-full">Free Review</Button>
            </Link>
            <button
              className="lg:hidden p-2 rounded-full hover:bg-muted"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden glass-nav rounded-3xl border border-amber-500/20 mt-2 p-4 animate-fade-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`px-4 py-3 rounded-2xl text-base font-medium transition-colors ${location.pathname === l.path ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:bg-muted'}`}
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/login" className="px-4 py-3 rounded-2xl text-base font-medium text-foreground/80 hover:bg-muted">
                Client Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

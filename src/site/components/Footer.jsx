import { Link } from 'react-router-dom'
import { Lamp, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="container-narrow px-5 md:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg mb-4">
              <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <Lamp className="w-4 h-4 text-white" />
              </span>
              Lantern Social
            </Link>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed">
              Warm, clear social media marketing that helps small businesses get noticed, connect with their community and win more customers.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 !text-secondary-foreground/90">Services</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/services" className="hover:text-primary transition-colors">Strategy</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Content Management</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Management</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Analytics &amp; Reporting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 !text-secondary-foreground/90">Company</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/results" className="hover:text-primary transition-colors">Case Studies</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 !text-secondary-foreground/90">Get Started</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li><Link to="/free-review" className="hover:text-primary transition-colors">Free Social Media Review</Link></li>
              <li><Link to="/packages" className="hover:text-primary transition-colors">View Packages</Link></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@lanternsocial.co.uk</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +44 7305 261693</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> United Kingdom</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-secondary-foreground/15 flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} Lantern Social. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/faq" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

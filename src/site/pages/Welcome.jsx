import { Link } from 'react-router-dom'
import { PartyPopper, Check } from 'lucide-react'
import { Button } from '../ui.jsx'
import { BUSINESS, BILLING_PORTAL_URL } from '../business.js'

export default function Welcome() {
  return (
    <section className="section-padding min-h-[70vh] flex items-center">
      <div className="container-narrow px-5 md:px-8 max-w-2xl text-center">
        <div className="w-20 h-20 rounded-3xl bg-accent/40 flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="w-10 h-10 text-teal" />
        </div>
        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">Welcome to Lantern Social!</h1>
        <p className="text-lg text-foreground/70 mb-8">
          Your subscription is set up and Stripe has emailed you a receipt. Here’s what happens next.
        </p>
        <div className="floating-card p-6 text-left mb-8">
          <ol className="space-y-3 text-sm text-foreground/70">
            <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> Theo will email you within one working day to book your welcome call.</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> Create your client portal login with the same email you used to pay.</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> In the portal, pick your brand colours and upload a few photos. Your first posts follow within 5 working days.</li>
          </ol>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/login"><Button className="btn-zest h-12 px-6">Create your portal login</Button></Link>
          <a href={`mailto:${BUSINESS.email}`}><Button className="btn-outline-ink h-12 px-6">Email Theo</Button></a>
        </div>
        {BILLING_PORTAL_URL && (
          <p className="text-sm text-foreground/50 mt-6">
            Need to update your card or cancel? <a href={BILLING_PORTAL_URL} className="text-primary hover:underline">Manage your billing</a>
          </p>
        )}
      </div>
    </section>
  )
}

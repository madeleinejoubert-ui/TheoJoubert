import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, Loader2, Lock } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { Button, Input, Label } from '../ui.jsx'
import { PLANS, TERMS_VERSION, BUSINESS } from '../business.js'

export default function Signup() {
  const [params] = useSearchParams()
  const planKey = params.get('plan')
  const plan = PLANS[planKey]
  const [form, setForm] = useState({ name: '', business_name: '', email: '', phone: '', agree: false })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sentManually, setSentManually] = useState(false)

  if (!plan) return <Navigate to="/packages" replace />

  const set = (k, v) => setForm({ ...form, [k]: v })
  const ready = form.name && form.business_name && form.email && form.agree

  async function submit(e) {
    e.preventDefault()
    if (!ready) return
    setBusy(true)
    setError('')
    const id = crypto.randomUUID()
    const { error } = await supabase.from('leads').insert({
      id,
      name: form.name,
      email: form.email,
      company: form.business_name,
      business_name: form.business_name,
      phone: form.phone || null,
      source: 'signup',
      plan: planKey,
      terms_version: TERMS_VERSION,
      terms_accepted_at: new Date().toISOString(),
      gdpr_consent: true,
      message: `Signed up online for the ${plan.name} package (£${plan.price}/month).`,
    })
    if (error) {
      setError(`Something went wrong. Please try again, or email ${BUSINESS.email}.`)
      setBusy(false)
      return
    }
    if (plan.link) {
      const url = new URL(plan.link)
      url.searchParams.set('prefilled_email', form.email)
      url.searchParams.set('client_reference_id', id)
      window.location.assign(url.toString())
    } else {
      setSentManually(true)
      setBusy(false)
    }
  }

  if (sentManually) {
    return (
      <section className="section-padding min-h-[60vh] flex items-center">
        <div className="container-narrow px-5 md:px-8 max-w-xl text-center">
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">Thanks, {form.name.split(' ')[0]}!</h1>
          <p className="text-lg text-foreground/70">
            We’ve received your sign-up for the {plan.name} package. Theo will email you a secure payment link
            within one working day to start your subscription.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8 max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-primary font-medium mb-2">Sign up</p>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-balance">{plan.name} package</h1>
          <p className="text-foreground/60 mt-4">£{plan.price} a month · paid monthly · cancel any time before your next payment</p>
        </div>

        <form onSubmit={submit} className="floating-card p-8 md:p-10 space-y-5">
          <div>
            <Label className="mb-1.5 block">Your name *</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} className="h-12 rounded-xl" required />
          </div>
          <div>
            <Label className="mb-1.5 block">Business name *</Label>
            <Input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} className="h-12 rounded-xl" required />
          </div>
          <div>
            <Label className="mb-1.5 block">Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="h-12 rounded-xl" required />
            <p className="text-xs text-foreground/50 mt-1.5">Use the email you want for your client portal login.</p>
          </div>
          <div>
            <Label className="mb-1.5 block">Phone</Label>
            <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="h-12 rounded-xl" />
          </div>

          <ul className="space-y-2 text-sm text-foreground/70 border-t border-border pt-5">
            <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> No minimum term</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> Cancel any time before your next monthly payment and you won’t be charged again</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> You approve every post before it goes live</li>
          </ul>

          <label className="flex items-start gap-3 text-sm text-foreground/70 cursor-pointer">
            <input type="checkbox" checked={form.agree} onChange={(e) => set('agree', e.target.checked)} className="mt-1 w-5 h-5 rounded accent-primary" />
            <span>
              I agree to the <Link to="/terms" target="_blank" className="text-primary hover:underline">Client Agreement</Link> and
              have read the <Link to="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>. *
            </span>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={!ready || busy} className="btn-zest w-full h-14 text-base gap-2">
            {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Please wait…</> : <>Continue to secure payment <ArrowRight className="w-5 h-5" /></>}
          </Button>
          <p className="text-xs text-foreground/50 text-center flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Card payments are processed securely by Stripe.
          </p>
        </form>
      </div>
    </section>
  )
}

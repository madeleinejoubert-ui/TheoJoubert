import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { Button, Input, Label } from '../ui.jsx'
import { ArrowRight, ArrowLeft, Check, Clock, Users, Eye, TrendingUp, Loader2, PartyPopper } from 'lucide-react'

const challenges = [
  { icon: Clock, label: "I don't have time" },
  { icon: Eye, label: "I don't know what to post" },
  { icon: TrendingUp, label: 'Not generating enquiries' },
  { icon: Users, label: 'Inconsistent posting' },
]

const platforms = ['Facebook', 'Instagram', 'LinkedIn', 'X (Twitter)', 'TikTok', 'Google Business', 'Not sure yet']
const budgets = ['Under £250/month', '£250–£500/month', '£500–£1,000/month', '£1,000+/month', 'Not sure yet']
const contacts = ['Email', 'Phone', 'Text message']

export default function FreeReview() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', business_name: '', industry: '', location: '',
    biggest_challenge: '', main_platform: '', budget_range: '',
    email: '', phone: '', website: '', profile_url: '', preferred_contact: 'Email',
    gdpr_consent: false,
  })

  const set = (k, v) => setForm({ ...form, [k]: v })
  const canNext = step === 1
    ? form.name && form.business_name && form.industry
    : step === 2
      ? form.biggest_challenge && form.main_platform && form.budget_range
      : form.email && form.gdpr_consent

  const submit = async () => {
    setSubmitting(true)
    setError('')
    const summary = [
      `Free review request from ${form.business_name} (${form.industry}${form.location ? `, ${form.location}` : ''}).`,
      `Challenge: ${form.biggest_challenge}. Platform: ${form.main_platform}. Budget: ${form.budget_range}.`,
      form.website ? `Website: ${form.website}.` : null,
      form.profile_url ? `Profile: ${form.profile_url}.` : null,
      `Prefers contact by ${form.preferred_contact.toLowerCase()}${form.phone ? ` (${form.phone})` : ''}.`,
    ].filter(Boolean).join(' ')

    const { error } = await supabase.from('leads').insert({
      name: form.name,
      email: form.email,
      company: form.business_name,
      message: summary,
      source: 'free_review',
      business_name: form.business_name,
      phone: form.phone || null,
      website: form.website || null,
      industry: form.industry || null,
      location: form.location || null,
      main_platform: form.main_platform || null,
      profile_url: form.profile_url || null,
      biggest_challenge: form.biggest_challenge || null,
      budget_range: form.budget_range || null,
      preferred_contact: form.preferred_contact || null,
      gdpr_consent: form.gdpr_consent,
    })
    if (error) setError('Something went wrong sending your request. Please try again, or email hello@lanternsocial.co.uk.')
    else setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <section className="section-padding min-h-[70vh] flex items-center">
        <div className="container-narrow px-5 md:px-8 max-w-2xl text-center">
          <div className="w-20 h-20 rounded-3xl bg-accent/40 flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 text-teal" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">Thank you, {form.name.split(' ')[0]}!</h1>
          <p className="text-lg text-foreground/70 mb-8">
            We've received your request for a free social media review. One of our team will be in touch within 1–2 business days to review your current social media presence and identify opportunities to improve.
          </p>
          <div className="floating-card p-6 text-left mb-8">
            <p className="font-heading font-semibold mb-2">What happens next?</p>
            <ol className="space-y-2 text-sm text-foreground/70">
              <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> We review your social media profiles</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> We identify what's working and what's holding you back</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-teal shrink-0 mt-0.5" /> We share practical recommendations — no obligation</li>
            </ol>
          </div>
          <Link to="/"><Button className="btn-outline-ink h-12 px-6">Back to home</Button></Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8 max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-primary font-medium mb-2">Free Social Media Review</p>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-balance">Find out what's holding your social media back</h1>
          <p className="text-foreground/60 mt-4">We'll review your current social media presence and identify opportunities to improve. No obligation, no cost.</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? 'bg-teal' : 'bg-muted'}`} />
          ))}
        </div>

        <div className="floating-card p-8 md:p-10">
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="text-xl font-heading font-bold">Who are we helping?</h2>
              <div>
                <Label className="mb-1.5 block">Your name *</Label>
                <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Smith" className="h-12 rounded-xl" />
              </div>
              <div>
                <Label className="mb-1.5 block">Business name *</Label>
                <Input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} placeholder="Smith & Co Florist" className="h-12 rounded-xl" />
              </div>
              <div>
                <Label className="mb-1.5 block">Industry *</Label>
                <Input value={form.industry} onChange={(e) => set('industry', e.target.value)} placeholder="e.g. Florist, Café, Salon" className="h-12 rounded-xl" />
              </div>
              <div>
                <Label className="mb-1.5 block">Location *</Label>
                <Input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Manchester, UK" className="h-12 rounded-xl" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="text-xl font-heading font-bold">What's the hurdle?</h2>
              <div>
                <Label className="mb-1.5 block">Biggest social media challenge *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {challenges.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => set('biggest_challenge', c.label)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${form.biggest_challenge === c.label ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20'}`}
                    >
                      <c.icon className="w-5 h-5 text-primary mb-2" />
                      <span className="text-sm font-medium">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Main social media platform *</Label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <button key={p} onClick={() => set('main_platform', p)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${form.main_platform === p ? 'bg-primary text-white' : 'bg-muted text-foreground/70 hover:bg-muted/70'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Monthly marketing budget *</Label>
                <div className="flex flex-wrap gap-2">
                  {budgets.map((b) => (
                    <button key={b} onClick={() => set('budget_range', b)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${form.budget_range === b ? 'bg-primary text-white' : 'bg-muted text-foreground/70 hover:bg-muted/70'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="text-xl font-heading font-bold">Where do we look?</h2>
              <div>
                <Label className="mb-1.5 block">Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@smithco.co.uk" className="h-12 rounded-xl" />
              </div>
              <div>
                <Label className="mb-1.5 block">Phone</Label>
                <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="07123 456789" className="h-12 rounded-xl" />
              </div>
              <div>
                <Label className="mb-1.5 block">Website</Label>
                <Input value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="www.smithco.co.uk" className="h-12 rounded-xl" />
              </div>
              <div>
                <Label className="mb-1.5 block">Social media profile URL</Label>
                <Input value={form.profile_url} onChange={(e) => set('profile_url', e.target.value)} placeholder="instagram.com/smithcoflorist" className="h-12 rounded-xl" />
              </div>
              <div>
                <Label className="mb-1.5 block">Preferred contact method</Label>
                <div className="flex gap-2">
                  {contacts.map((c) => (
                    <button key={c} onClick={() => set('preferred_contact', c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${form.preferred_contact === c ? 'bg-primary text-white' : 'bg-muted text-foreground/70'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-3 text-sm text-foreground/70 cursor-pointer">
                <input type="checkbox" checked={form.gdpr_consent} onChange={(e) => set('gdpr_consent', e.target.checked)} className="mt-1 w-5 h-5 rounded accent-primary" />
                <span>I consent to Lantern Social contacting me about my free social media review. I understand my data will be stored securely and not shared with third parties. I can request deletion of my data at any time. *</span>
              </label>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button onClick={() => setStep(step - 1)} className="btn-outline-ink h-12 px-6 gap-2" disabled={submitting}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canNext} className="btn-zest h-12 px-6 gap-2 ml-auto">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={!canNext || submitting} className="btn-zest h-12 px-6 gap-2 ml-auto">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Get my free review <ArrowRight className="w-4 h-4" /></>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

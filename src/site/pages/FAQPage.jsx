import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, ShieldCheck, ArrowRight } from 'lucide-react'
import FAQAccordion from '../components/FAQAccordion.jsx'
import CTASection from '../components/CTASection.jsx'

const policies = [
  { to: '/terms', icon: FileText, title: 'Client Agreement', text: 'The one-page agreement you accept when you sign up: what we do, monthly payment, and cancelling any time before your next payment.' },
  { to: '/privacy', icon: ShieldCheck, title: 'Privacy Policy', text: 'What information we collect, why, who we share it with, how long we keep it and your rights.' },
]

export default function FAQPage() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <>
      <section className="section-padding pb-0">
        <div className="container-narrow px-5 md:px-8 text-center">
          <p className="text-primary font-medium mb-2">FAQ</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-balance mb-6">Frequently asked questions</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
            Honest answers to the questions small business owners ask us most. Don't see yours? Get in touch.
          </p>
        </div>
      </section>
      <FAQAccordion showAll limit={20} />
      <section id="policies" className="px-5 md:px-8 pb-16 md:pb-24 scroll-mt-28 pt-4">
        <div className="container-narrow max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-center">Policies</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {policies.map(({ to, icon: Icon, title, text }) => (
              <Link key={to} to={to} className="floating-card-hover p-6 block group">
                <Icon className="w-6 h-6 text-teal mb-3" />
                <h3 className="font-heading font-semibold text-lg mb-2 flex items-center gap-2">
                  {title} <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="text-sm text-foreground/60">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  )
}

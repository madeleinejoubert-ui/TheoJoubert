import CTASection from '../components/CTASection.jsx'
import FounderSection from '../components/FounderSection.jsx'
import { Heart, Target, Eye, Handshake, Zap, ShieldCheck } from 'lucide-react'
import { Img } from '../ui.jsx'

const values = [
  { icon: Heart, title: 'Human support', desc: 'You work with a real person who knows your business — not a faceless software platform.' },
  { icon: Target, title: 'Results-focused', desc: 'We focus on what matters: engagement, enquiries and growth — not vanity metrics.' },
  { icon: Eye, title: 'Transparent', desc: 'Clear pricing, clear deliverables, clear reporting. No hidden fees or surprises.' },
  { icon: Handshake, title: 'Your marketing partner', desc: "We're not a big corporate agency. We're your dedicated marketing partner." },
  { icon: Zap, title: 'Practical', desc: 'Strategies that actually work for small businesses with limited time and resources.' },
  { icon: ShieldCheck, title: 'Affordable', desc: 'Far more cost-effective than hiring an in-house social media manager.' },
]

export default function About() {
  return (
    <>
      <section className="section-padding pb-0">
        <div className="container-narrow px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary font-medium mb-2">About Us</p>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-balance mb-6">Your marketing partner, not just another agency</h1>
              <p className="text-lg text-foreground/70 mb-4">
                Lantern Social was founded with a simple belief: every small business deserves to shine online — without the complexity, cost and jargon of a big agency.
              </p>
              <p className="text-lg text-foreground/70">
                We saw too many local businesses struggling to keep up with social media — posting inconsistently, unsure what to say, and never knowing if any of it was actually working. So we built a service that takes the whole thing off their plate.
              </p>
            </div>
            <div className="floating-card overflow-hidden p-2">
              <Img
                src="/images/about-shop.png"
                alt="A small business owner working in their shop"
                className="w-full aspect-[4/3] rounded-[1.5rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-5 md:px-8 max-w-3xl">
          <div className="floating-card bg-accent/10 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Our mission</h2>
            <p className="text-lg text-foreground/70 leading-relaxed">
              To help small businesses get noticed, grow and win more customers through social media — without having to do it all themselves. We plan it, we create it, we schedule it, we analyse it. You run your business.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-narrow px-5 md:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Our values</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold">What we stand for</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="floating-card-hover p-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/30 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-lg font-heading font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FounderSection />

      <CTASection />
    </>
  )
}

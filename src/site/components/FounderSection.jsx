import { Lamp } from 'lucide-react'
import { Img } from '../ui.jsx'

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}

export default function FounderSection() {
  return (
    <section className="section-padding pt-0">
      <div className="container-narrow px-5 md:px-8">
        <div className="floating-card overflow-hidden grid md:grid-cols-5 gap-0">
          <div className="md:col-span-2 bg-accent/20 p-8 md:p-10 flex flex-col justify-center">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-background shadow-lg">
              <Img
                src="/images/founder-theo.png"
                alt="Theo Joubert, Founder of Lantern Social"
                className="w-full h-full"
                style={{ objectPosition: '50% 40%' }}
              />
            </div>
            <h3 className="text-2xl font-heading font-bold text-center">Theo Joubert</h3>
            <p className="text-primary font-medium text-center mb-1">Founder &amp; Social Media Manager</p>
            <p className="text-sm text-foreground/50 text-center mb-4">London, United Kingdom</p>
            <a
              href="https://uk.linkedin.com/in/theo-joubert-081aa5136"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" /> Connect on LinkedIn
            </a>
          </div>

          <div className="md:col-span-3 p-8 md:p-10">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
              <Lamp className="w-4 h-4" /> Meet the founder
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-balance">
              The person behind your social media
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              <p>
                Theo Joubert is a London-based marketing professional with a background in marketing
                analytics and customer relations. He trained in Marketing Measurement Strategy through
                UC Berkeley's BUSADM466 Marketing Analytics programme, building a data-led approach to
                understanding what actually drives engagement, enquiries and growth.
              </p>
              <p>
                With a hands-on, creative edge shaped by experience across marketing, customer relations
                and interior decorating, Theo founded Lantern Social to give small businesses something
                most can't access: a dedicated partner who knows their numbers, plans content around
                real goals, and treats every follower and enquiry as if it were their own.
              </p>
              <p>
                Today he works directly with every client — measuring, scheduling and refining their
                social media so owners can get back to running their business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

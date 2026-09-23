import { Link } from 'react-router-dom'
import { Check, Star, ArrowRight } from 'lucide-react'
import { Button } from '../ui.jsx'

const packages = [
  { name: 'Starter', tagline: 'For businesses that need consistency', price_display: 'From £295', features: ['2 social platforms', 'Monthly content strategy', '6 posts per month', 'Content scheduling', 'Monthly performance report', 'Monthly strategy check-in'], is_popular: false },
  { name: 'Growth', tagline: 'For businesses ready to become more visible', price_display: 'From £495', features: ['Up to 3 social platforms', '9 posts per month', 'Reels/video content concepts', 'Content scheduling', 'Engagement monitoring', 'Monthly analytics report', 'Monthly strategy call'], is_popular: true },
  { name: 'Pro', tagline: 'For businesses wanting a comprehensive presence', price_display: 'From £795', features: ['Up to 4 social platforms', '12 posts per month', 'Increased short-form video content', 'Community engagement', 'Campaign planning', 'Detailed analytics', 'Monthly strategy meeting', 'Priority support'], is_popular: false },
]

export default function PackagesSection({ showAll = false }) {
  return (
    <section className="section-padding bg-card/40">
      <div className="container-narrow px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Packages</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-balance">Simple, transparent pricing</h2>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">Affordable monthly packages designed for small businesses. No hidden fees, no long contracts.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`floating-card-hover p-8 relative ${pkg.is_popular ? 'ring-2 ring-primary' : ''}`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Most Popular
                </div>
              )}
              <h3 className="text-2xl font-heading font-bold mb-1">{pkg.name}</h3>
              <p className="text-sm text-foreground/60 mb-4">{pkg.tagline}</p>
              <p className="text-3xl font-heading font-bold text-ink mb-6">{pkg.price_display}<span className="text-base font-normal text-foreground/50">/month</span></p>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/70">
                    <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/free-review" className="block">
                <Button className={pkg.is_popular ? 'btn-zest w-full h-12' : 'btn-outline-ink w-full h-12'}>
                  Book a Free Consultation
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-foreground/60">
          Not sure which package is right for you? <Link to="/free-review" className="text-primary font-medium hover:underline">Get a free social media review →</Link>
        </p>
        {!showAll && (
          <div className="text-center mt-6">
            <Link to="/packages">
              <Button className="btn-outline-ink h-12 px-6 gap-2">
                Compare all packages <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

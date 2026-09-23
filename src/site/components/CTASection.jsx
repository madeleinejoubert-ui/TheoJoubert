import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui.jsx'

export default function CTASection({
  title = 'Ready to get your social media working?',
  subtitle = "Get a free, no-obligation review of your current social media presence and discover what's holding you back.",
  primaryLabel = 'Get Your Free Social Media Review',
  primaryTo = '/free-review',
  secondaryLabel = 'Book a Free Consultation',
  secondaryTo = '/free-review',
}) {
  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8">
        <div className="floating-card bg-gradient-to-br from-secondary to-secondary/90 text-secondary-foreground p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold !text-secondary-foreground text-balance mb-4">
            {title}
          </h2>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto mb-8 text-balance">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={primaryTo}>
              <Button className="btn-zest h-14 px-8 text-base gap-2">
                {primaryLabel}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to={secondaryTo}>
              <Button className="btn-outline-ink h-14 px-8 text-base border-secondary-foreground/30 !text-secondary-foreground hover:bg-secondary-foreground/10">
                {secondaryLabel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

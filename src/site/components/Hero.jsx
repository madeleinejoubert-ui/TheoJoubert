import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, TrendingUp } from 'lucide-react'
import { Button, Img } from '../ui.jsx'

export default function Hero() {
  return (
    <section className="section-padding pt-8 md:pt-12 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(650px_420px_at_85%_-10%,rgba(245,158,11,0.2),transparent_65%)]" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_top,rgba(87,83,78,0.07),transparent_45%)]" />
      <div className="relative container-narrow px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 text-ink text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Social media marketing for small businesses
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] text-balance mb-6">
              Illuminate your <span className="gradient-text">social presence.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-8 max-w-xl leading-relaxed">
              Warm, jargon-free social media marketing for small businesses. We plan, create, schedule and measure your social media so you can focus on running your business — while your brand shines online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/free-review">
                <Button className="btn-zest h-14 px-8 text-base gap-2 w-full sm:w-auto">
                  Get Your Free Social Media Review
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/packages">
                <Button className="btn-outline-ink h-14 px-8 text-base w-full sm:w-auto">
                  See Our Packages
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-foreground/50">
              We plan it. We create it. We schedule it. We analyse it. <span className="font-medium text-foreground/70">You run your business.</span>
            </p>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="floating-card overflow-hidden p-2">
              <Img
                src="/images/hero-highstreet.jpg"
                alt="A bustling high street with independent shops, including Bloom & Stem Florist"
                className="w-full aspect-[4/3] rounded-lg"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 floating-card p-4 items-center gap-3 animate-float hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-ink">+24%</p>
                <p className="text-xs text-foreground/60">Engagement</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 floating-card p-4 items-center gap-3 animate-float hidden sm:flex" style={{ animationDelay: '1s' }}>
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-heading font-bold text-ink">12 posts</p>
                <p className="text-xs text-foreground/60">Scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

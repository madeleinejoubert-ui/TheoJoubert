import { TrendingUp, Sparkles } from 'lucide-react'
import CTASection from '../components/CTASection.jsx'

const realCase = {
  business_name: 'Little Lantern Stories',
  industry: 'Storytelling & Content — Facebook',
  starting_situation: 'A brand-new Facebook page with just 9 followers — no posting rhythm, no reach, and no income from content. Starting from zero.',
  strategy: 'A consistent short-form content engine: story content planned and scheduled through Metricool, posted near-daily, with formats refined week by week based on what the analytics actually showed.',
  work_completed: '338 pieces of content created and published, a sustained daily posting schedule, community engagement, and analytics-led optimisation throughout.',
  results: 'From 9 to 600 followers in 7 weeks, 118.5K content views and 2,556 page visits — and the Meta accounts hit the threshold to start monetising.',
  before_metrics: '9 followers, minimal reach, no monetisation.',
  after_metrics: '600 followers, 118.5K views, 2,556 page visits, monetising through Meta.',
  stats: [
    { value: '9 → 600', label: 'followers in 7 weeks' },
    { value: '118.5K', label: 'content views' },
    { value: '338', label: 'pieces of content' },
    { value: 'Monetising', label: 'Meta monetisation unlocked' },
  ],
}

const exampleCases = [
  {
    business_name: 'Example Café',
    industry: 'Hospitality',
    starting_situation: 'A local café with an inactive social media presence. Posts were sporadic, there was no content strategy, and the business had low visibility in the local area.',
    strategy: 'We developed a content strategy focused on showcasing daily specials, behind-the-scenes content, and customer experiences. We prioritised Instagram and Facebook for visual appeal and local reach.',
    work_completed: 'Monthly content calendar, 12–16 posts per month, reels showcasing menu items, community engagement, and local awareness posts.',
    results: 'This is a placeholder example. Real case study results will appear here once the agency has collected them.',
    before_metrics: 'Inconsistent posting, low engagement, minimal local reach.',
    after_metrics: 'Consistent posting schedule, improved engagement, increased local visibility.',
  },
  {
    business_name: 'Example Salon',
    industry: 'Beauty & Wellness',
    starting_situation: "A beauty salon with no time to manage social media. The owner wanted to attract new clients but didn't know what to post.",
    strategy: 'We created a content strategy around treatment showcases, before-and-after content, and educational posts about skincare and beauty tips.',
    work_completed: 'Monthly content calendar, 16 posts per month, reels of treatments, client testimonials, and promotional content.',
    results: 'This is a placeholder example. Real case study results will appear here once the agency has collected them.',
    before_metrics: 'No regular posting, no engagement, no enquiries from social media.',
    after_metrics: 'Regular posting, growing engagement, enquiries coming through social media.',
  },
]

export default function Results() {
  return (
    <>
      <section className="section-padding pb-0">
        <div className="container-narrow px-5 md:px-8 text-center">
          <p className="text-primary font-medium mb-2">Case Studies</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-balance mb-6">Real growth for real businesses</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
            See how we grow a social presence from nothing — starting with the growth story behind our own name.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-5 md:px-8 space-y-8">
          <div className="floating-card p-8 md:p-10 ring-2 ring-primary">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-primary text-primary-foreground mb-4">
              <Sparkles className="w-3 h-3" /> Real case study
            </span>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-teal" />
              <span className="text-sm font-medium text-foreground/60">{realCase.industry}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">{realCase.business_name}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {realCase.stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-background/60 border border-border p-4">
                  <p className="text-2xl md:text-3xl font-heading font-bold text-ink">{s.value}</p>
                  <p className="text-xs text-foreground/60 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading font-semibold mb-2 !text-primary">Starting situation</h3>
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">{realCase.starting_situation}</p>
                <h3 className="font-heading font-semibold mb-2 !text-primary">Strategy</h3>
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">{realCase.strategy}</p>
                <h3 className="font-heading font-semibold mb-2 !text-primary">Work completed</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{realCase.work_completed}</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-2 !text-teal">Before</h3>
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">{realCase.before_metrics}</p>
                <h3 className="font-heading font-semibold mb-2 !text-teal">After</h3>
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">{realCase.after_metrics}</p>
                <h3 className="font-heading font-semibold mb-2 !text-teal">Results</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{realCase.results}</p>
              </div>
            </div>
          </div>
          {exampleCases.map((c, i) => (
            <div key={i} className="floating-card p-8 md:p-10">
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-muted text-foreground/50 mb-4">Example case study</span>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-teal" />
                <span className="text-sm font-medium text-foreground/60">{c.industry}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">{c.business_name}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-heading font-semibold mb-2 !text-primary">Starting situation</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">{c.starting_situation}</p>
                  <h3 className="font-heading font-semibold mb-2 !text-primary">Strategy</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">{c.strategy}</p>
                  <h3 className="font-heading font-semibold mb-2 !text-primary">Work completed</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{c.work_completed}</p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-2 !text-teal">Before</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">{c.before_metrics}</p>
                  <h3 className="font-heading font-semibold mb-2 !text-teal">After</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">{c.after_metrics}</p>
                  <h3 className="font-heading font-semibold mb-2 !text-teal">Results</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{c.results}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  )
}

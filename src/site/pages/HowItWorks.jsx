import { Search, ClipboardList, PenTool, BarChart3 } from 'lucide-react'
import CTASection from '../components/CTASection.jsx'

const steps = [
  { icon: Search, title: 'Discover', desc: "We learn about your business, your customers, your goals and your competitors. We look at what's working (and what isn't) on your current social media.", points: ['Business goals workshop', 'Audience research', 'Competitor analysis', 'Current social media audit'] },
  { icon: ClipboardList, title: 'Plan', desc: 'We build a practical social media strategy and a monthly content calendar tailored to your business and your audience.', points: ['Content strategy', 'Platform selection', 'Monthly content calendar', 'Theme and topic planning'] },
  { icon: PenTool, title: 'Manage & Schedule', desc: 'We take the content you provide, refine captions and visuals, and schedule it using professional social media management tools such as Metricool so your posts go out consistently and on time.', points: ['Caption writing and editing', 'Visual formatting', 'Content calendar management', 'Scheduling and publishing'] },
  { icon: BarChart3, title: 'Measure & Improve', desc: "We analyse the results every month and continually refine the strategy based on what's driving engagement, reach and enquiries.", points: ['Monthly performance reports', 'Engagement analysis', 'Content optimisation', 'Strategy refinement'] },
]

export default function HowItWorks() {
  return (
    <>
      <section className="section-padding pb-0">
        <div className="container-narrow px-5 md:px-8 text-center">
          <p className="text-primary font-medium mb-2">How It Works</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-balance mb-6">From overwhelmed to organised</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
            A clear, simple process that takes social media off your plate and turns it into a marketing channel that works.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-narrow px-5 md:px-8 max-w-4xl">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex gap-6 mb-8 last:mb-0">
                <div className="hidden md:flex w-12 h-12 rounded-2xl bg-primary text-white items-center justify-center font-heading font-bold shrink-0 z-10">
                  {i + 1}
                </div>
                <div className="floating-card-hover p-8 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <step.icon className="w-6 h-6 text-teal md:hidden" />
                    <h3 className="text-xl font-heading font-bold">{step.title}</h3>
                  </div>
                  <p className="text-foreground/70 mb-4">{step.desc}</p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {step.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-foreground/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  )
}

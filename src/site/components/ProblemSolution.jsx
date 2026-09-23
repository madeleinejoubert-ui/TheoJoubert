import { X, Check } from 'lucide-react'

const problems = [
  "I don't know what to post",
  "I don't have time to manage social media",
  'I post inconsistently',
  "My social media isn't generating enquiries",
  "I don't know what's actually working",
  "I can't afford a full-time social media manager",
]

const solutions = [
  'We plan your content strategy for you',
  'We create and schedule everything',
  'Consistent posting, every week',
  'Content designed to drive enquiries',
  "Monthly reports show what's working",
  'Affordable packages for small businesses',
]

export default function ProblemSolution() {
  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="floating-card p-8 md:p-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <X className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">Sound familiar?</h2>
            <p className="text-foreground/60 mb-6">Most small business owners feel the same way about social media.</p>
            <ul className="space-y-3">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-primary" />
                  </span>
                  <span className="text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="floating-card p-8 md:p-10 bg-accent/10">
            <div className="w-12 h-12 rounded-2xl bg-accent/40 flex items-center justify-center mb-6">
              <Check className="w-6 h-6 text-teal" />
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">Here's how we help</h2>
            <p className="text-foreground/60 mb-6">We take social media off your plate and make it work for your business.</p>
            <ul className="space-y-3">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-teal" />
                  </span>
                  <span className="text-foreground/80">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { Search, ClipboardList, PenTool, BarChart3 } from 'lucide-react'
import { Button } from '../ui.jsx'

const steps = [
  { icon: Search, title: 'Discover', desc: 'We learn about your business, customers and goals.' },
  { icon: ClipboardList, title: 'Plan', desc: 'We build a practical social media strategy and content calendar.' },
  { icon: PenTool, title: 'Create & Schedule', desc: 'We create content and schedule it using professional social media management tools.' },
  { icon: BarChart3, title: 'Measure & Improve', desc: 'We analyse the results and continually improve the strategy.' },
]

export default function ProcessPreview() {
  return (
    <section className="section-padding bg-card/40">
      <div className="container-narrow px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">How it works</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-balance">A simple 4-step process</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="floating-card-hover p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-bold text-sm">
                    {i + 1}
                  </span>
                  <step.icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="text-lg font-heading font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/how-it-works">
            <Button className="btn-outline-ink h-12 px-6">See the full process</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

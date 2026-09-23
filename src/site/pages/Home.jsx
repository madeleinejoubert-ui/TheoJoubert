import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Hero from '../components/Hero.jsx'
import MetricsTicker from '../components/MetricsTicker.jsx'
import ProblemSolution from '../components/ProblemSolution.jsx'
import ProcessPreview from '../components/ProcessPreview.jsx'
import ServicesGrid from '../components/ServicesGrid.jsx'
import PackagesSection from '../components/PackagesSection.jsx'
import WhyChooseUs from '../components/WhyChooseUs.jsx'
import TestimonialsSection from '../components/TestimonialsSection.jsx'
import FAQAccordion from '../components/FAQAccordion.jsx'
import CTASection from '../components/CTASection.jsx'

const exampleCases = [
  { business_name: 'Example Café', industry: 'Hospitality', starting_situation: 'Inconsistent posting, no content strategy, low local visibility.', results: 'This is a placeholder example. Real case study results will appear here.' },
  { business_name: 'Example Salon', industry: 'Beauty & Wellness', starting_situation: 'No time for social media, no engagement from followers.', results: 'This is a placeholder example. Real case study results will appear here.' },
]

function CaseStudiesPreview() {
  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-primary font-medium mb-2">Results</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-balance">Real growth for real businesses</h2>
          </div>
          <Link to="/results" className="text-primary font-medium hover:underline flex items-center gap-1">
            See all case studies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {exampleCases.map((c, i) => (
            <div key={i} className="floating-card-hover p-8">
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-muted text-foreground/50 mb-4">Example</span>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-teal" />
                <span className="text-sm font-medium text-foreground/60">{c.industry}</span>
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{c.business_name}</h3>
              <p className="text-sm text-foreground/60 mb-2"><strong className="text-foreground/80">Starting point:</strong> {c.starting_situation}</p>
              <p className="text-sm text-foreground/60"><strong className="text-foreground/80">Results:</strong> {c.results}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <MetricsTicker />
      <ProblemSolution />
      <ProcessPreview />
      <ServicesGrid />
      <PackagesSection />
      <WhyChooseUs />
      <CaseStudiesPreview />
      <TestimonialsSection />
      <FAQAccordion />
      <CTASection />
    </>
  )
}

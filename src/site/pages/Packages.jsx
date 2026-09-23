import PackagesSection from '../components/PackagesSection.jsx'
import CTASection from '../components/CTASection.jsx'

export default function Packages() {
  return (
    <>
      <section className="section-padding pb-0">
        <div className="container-narrow px-5 md:px-8 text-center">
          <p className="text-primary font-medium mb-2">Packages</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-balance mb-6">Choose your package</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
            Transparent pricing with no hidden fees. Every package includes content management, scheduling, and monthly reporting. Cancel anytime.
          </p>
        </div>
      </section>
      <PackagesSection showAll />
      <CTASection
        title="Not sure which package is right for you?"
        subtitle="Get a free social media review and we'll recommend the best package for your business and budget."
        primaryLabel="Get Your Free Social Media Review"
      />
    </>
  )
}

import ServicesGrid from '../components/ServicesGrid.jsx'
import CTASection from '../components/CTASection.jsx'

export default function Services() {
  return (
    <>
      <section className="section-padding pb-0">
        <div className="container-narrow px-5 md:px-8 text-center">
          <p className="text-primary font-medium mb-2">Our Services</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-balance mb-6">A complete social media service</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
            We use professional social media management and analytics technology to plan, schedule and measure your content — giving you a clear view of what's working and where we can improve.
          </p>
        </div>
      </section>
      <ServicesGrid showAll />
      <CTASection
        title="See how we can help your business"
        subtitle="Get a free review of your current social media and a personalised recommendation."
      />
    </>
  )
}

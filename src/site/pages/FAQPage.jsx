import FAQAccordion from '../components/FAQAccordion.jsx'
import CTASection from '../components/CTASection.jsx'

export default function FAQPage() {
  return (
    <>
      <section className="section-padding pb-0">
        <div className="container-narrow px-5 md:px-8 text-center">
          <p className="text-primary font-medium mb-2">FAQ</p>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-balance mb-6">Frequently asked questions</h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
            Honest answers to the questions small business owners ask us most. Don't see yours? Get in touch.
          </p>
        </div>
      </section>
      <FAQAccordion showAll limit={20} />
      <CTASection />
    </>
  )
}

export default function LegalPage({ eyebrow, title, updated, children }) {
  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8 max-w-3xl">
        <p className="text-primary font-medium mb-2">{eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-balance mb-3">{title}</h1>
        <p className="text-sm text-foreground/50 mb-10">{updated}</p>
        <div className="legal-body floating-card p-8 md:p-10">{children}</div>
      </div>
    </section>
  )
}

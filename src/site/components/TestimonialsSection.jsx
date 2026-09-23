import { Star, Quote } from 'lucide-react'

const testimonials = [
  { client_name: 'Demo Client', business_name: 'Example Bakery', quote: 'This is a placeholder testimonial. Real client testimonials will appear here once the agency has collected them.', rating: 5, industry: 'Hospitality' },
  { client_name: 'Demo Client', business_name: 'Example Salon', quote: 'This is a placeholder testimonial showing how real client feedback will be displayed on the site.', rating: 5, industry: 'Beauty & Wellness' },
  { client_name: 'Demo Client', business_name: 'Example Trades', quote: 'This is a placeholder testimonial. Replace with real testimonials from satisfied clients.', rating: 5, industry: 'Trades' },
]

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-card/40">
      <div className="container-narrow px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Client stories</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-balance">Trusted by small businesses</h2>
          <p className="text-foreground/50 mt-4 text-sm">Real testimonials will replace these placeholders as the agency grows.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="floating-card p-8 relative">
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="font-heading font-bold text-ink">{t.client_name}</p>
                <p className="text-sm text-foreground/50">{t.business_name}{t.industry ? ` · ${t.industry}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

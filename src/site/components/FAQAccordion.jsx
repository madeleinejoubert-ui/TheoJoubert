import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Button } from '../ui.jsx'

const faqs = [
  { question: 'What social media platforms do you manage?', answer: "We manage Facebook, Instagram, LinkedIn, Google Business Profile and more. We'll recommend the best platforms for your business during your free review." },
  { question: 'Do you create the content for us?', answer: "Yes. We create posts, captions, graphics and video concepts as part of your package. You can provide photos and videos too, but it's not required." },
  { question: 'How often will you post?', answer: 'Every day. Depending on your package we create 6–16 ads daily and post up to 6, 9 or 12 times a day across your channels. We recommend the right level based on your goals and budget.' },
  { question: 'Can I approve posts before they go live?', answer: "Absolutely. Every post goes through your approval before publishing. You're always in control of what represents your business." },
  { question: 'How much does social media management cost?', answer: "Our packages start from £295 per month. We'll recommend the right package during your free consultation based on your needs and budget." },
]

export default function FAQAccordion({ limit = 5, showAll = false }) {
  const [open, setOpen] = useState(0)
  const display = showAll ? faqs : faqs.slice(0, limit)

  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-balance">Questions? We've got answers</h2>
        </div>
        <div className="space-y-3">
          {display.map((faq, i) => (
            <div key={i} className="floating-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left focus-ring"
              >
                <span className="font-heading font-semibold text-ink pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-foreground/50 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-foreground/70 leading-relaxed animate-fade-up">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        {!showAll && (
          <div className="text-center mt-8">
            <Link to="/faq">
              <Button className="btn-outline-ink h-12 px-6">See all FAQs</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

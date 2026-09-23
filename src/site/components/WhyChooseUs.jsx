import { Clock, Heart, BarChart3, Users, MapPin, MessageCircle } from 'lucide-react'

const reasons = [
  { icon: Clock, title: 'Save time', desc: 'We take social media off your plate so you can focus on running your business.' },
  { icon: Heart, title: 'Human support', desc: 'You work with a real person who knows your business — not complicated software.' },
  { icon: BarChart3, title: 'Measurable results', desc: "Monthly reports show exactly what's working and where we can improve." },
  { icon: Users, title: 'Consistency', desc: 'Professional content posted consistently, every single week.' },
  { icon: MapPin, title: 'Local business focus', desc: 'We specialise in helping small, local businesses grow their presence.' },
  { icon: MessageCircle, title: 'Easy approval process', desc: "You approve every post before it goes live. You're always in control." },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8">
        <div className="floating-card bg-secondary text-secondary-foreground p-8 md:p-12 mb-10 text-center">
          <p className="text-2xl md:text-4xl font-heading font-bold text-balance !text-secondary-foreground">
            "Marketing should make running your business easier — not become another job."
          </p>
        </div>
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">Why choose us</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-balance">Built for small businesses</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="floating-card-hover p-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/30 flex items-center justify-center mb-4">
                <r.icon className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-lg font-heading font-bold mb-2">{r.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

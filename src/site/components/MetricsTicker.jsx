import { TrendingUp, Users, Eye, MessageCircle, Calendar, Target } from 'lucide-react'

const items = [
  { icon: TrendingUp, label: '+24% Engagement', color: 'text-primary' },
  { icon: Users, label: '8 New Enquiries', color: 'text-teal' },
  { icon: Eye, label: '12K Reach', color: 'text-primary' },
  { icon: MessageCircle, label: '47 Comments', color: 'text-teal' },
  { icon: Calendar, label: 'Post Scheduled', color: 'text-primary' },
  { icon: Target, label: '3 New Followers', color: 'text-teal' },
]

export default function MetricsTicker() {
  return (
    <section className="py-6 overflow-hidden border-y border-border/60 bg-card/50">
      <div className="flex animate-marquee gap-8 whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="font-medium text-foreground/80">{item.label}</span>
            <span className="text-border ml-8">•</span>
          </div>
        ))}
      </div>
    </section>
  )
}

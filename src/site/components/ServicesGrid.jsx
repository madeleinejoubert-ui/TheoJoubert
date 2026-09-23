import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '../ui.jsx'

const services = [
  { title: 'Social Media Strategy', description: 'Content strategy, platform selection, audience research, competitor research and monthly content planning.', features: ['Content strategy', 'Platform selection', 'Audience research', 'Competitor research', 'Monthly content planning'] },
  { title: 'Content Management', description: 'We manage, refine, and schedule the content you provide — polishing captions, formatting visuals, and optimising every post for engagement.', features: ['Caption writing and editing', 'Visual formatting and graphics', 'Reels/video concept guidance', 'Content scheduling', 'Content calendar management'] },
  { title: 'Social Media Management', description: 'Content scheduling, publishing, community management, engagement monitoring and content calendar management.', features: ['Content scheduling', 'Publishing', 'Community management', 'Engagement monitoring', 'Content calendar management'] },
  { title: 'Analytics & Reporting', description: 'Monthly performance reports, engagement analysis, reach, impressions, follower growth and recommendations.', features: ['Monthly performance reports', 'Engagement analysis', 'Reach and impressions', 'Follower growth', 'Recommendations'] },
  { title: 'Local Business Growth', description: 'Local awareness campaigns, location-focused content, promotions, community engagement and customer review content.', features: ['Local awareness campaigns', 'Location-focused content', 'Promotions', 'Community engagement', 'Customer review content'] },
  { title: 'Business Websites', description: 'We also design and develop professional business websites — built in your brand colours and designed to turn visitors into enquiries.', features: ['Custom design and development', 'Built around your brand', 'Mobile-friendly and fast', 'Enquiry and contact forms', 'Domain and hosting setup'] },
]

export default function ServicesGrid({ showAll = false }) {
  const display = services.slice(0, showAll ? 12 : 3)

  return (
    <section className="section-padding">
      <div className="container-narrow px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">What we do</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-balance">Everything you need, handled for you</h2>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">From strategy to content to reporting — a complete social media service for your small business.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((s) => (
            <div key={s.title} className="floating-card-hover p-8">
              <h3 className="text-xl font-heading font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-foreground/60 mb-5 leading-relaxed">{s.description}</p>
              <ul className="space-y-2">
                {s.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/70">
                    <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {!showAll && (
          <div className="text-center mt-10">
            <Link to="/services">
              <Button className="btn-outline-ink h-12 px-6 gap-2">
                Explore all services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

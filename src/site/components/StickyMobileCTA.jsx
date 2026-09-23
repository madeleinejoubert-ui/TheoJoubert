import { Link } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import { Button } from '../ui.jsx'

export default function StickyMobileCTA() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-background via-background/95 to-transparent pb-4">
      <div className="flex gap-2">
        <Link to="/free-review" className="flex-1">
          <Button className="btn-zest w-full h-12 rounded-full text-sm gap-2">
            <CalendarCheck className="w-4 h-4" />
            Free Social Media Review
          </Button>
        </Link>
        <Link to="/packages" className="flex-1">
          <Button className="btn-outline-ink w-full h-12 rounded-full text-sm">
            See Packages
          </Button>
        </Link>
      </div>
    </div>
  )
}

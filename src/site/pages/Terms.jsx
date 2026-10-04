import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage.jsx'
import { BUSINESS, TERMS_VERSION } from '../business.js'

export default function Terms() {
  return (
    <LegalPage eyebrow="Client Agreement" title="Lantern Social Client Agreement" updated={`Version ${TERMS_VERSION}`}>
      <p>
        This agreement is between <strong>{BUSINESS.trader}, trading as {BUSINESS.tradingName}</strong> (“we”, “us”)
        and the business signing up for a package (“you”). You accept it when you tick the agreement box and
        start your subscription.
      </p>

      <h2>1. What we do</h2>
      <p>
        We provide the social media package you chose at sign-up, as described on our{' '}
        <Link to="/packages">Packages page</Link> at that date: content planning, post creation, scheduling and
        monthly reporting. Paid advertising spend is not included. If you want paid promotion, the ad budget is
        agreed separately and paid by you directly to the platform.
      </p>

      <h2>2. Your approval and your materials</h2>
      <p>
        You approve posts in your client portal before they are published, and you can ask for changes. You
        confirm that you own, or have permission to use, the photos, logos and other materials you give us,
        and that the information you give us about your business is accurate.
      </p>

      <h2>3. Price and payment</h2>
      <p>
        The monthly price is the one shown for your package at sign-up. Payment is taken monthly in advance by
        card through Stripe, on the same date each month as your first payment. We are not currently VAT
        registered, so no VAT is added. We will give you at least 30 days’ notice by email of any price change,
        and you can cancel before it takes effect.
      </p>

      <h2>4. Cancel any time</h2>
      <p>
        There is no minimum term. <strong>You can cancel at any time before your next monthly payment is
        taken, and no further payments will be charged.</strong> To cancel, use the billing link in your
        confirmation email or email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. We will confirm
        your cancellation in writing. Your service continues until the end of the month you have already paid
        for. Payments for a month that has already started are not refunded.
      </p>
      <p>
        We can end the agreement with 30 days’ written notice, or straight away if a payment fails and is not
        made within 7 days, or if you ask us to publish anything unlawful or misleading.
      </p>

      <h2>5. Your accounts and content</h2>
      <p>
        Your social media accounts stay yours. We use the access you give us only to provide the service, and
        you can remove our access at any time. Once paid for, the posts and graphics we create for you are
        yours to keep and reuse. We may show examples of our work for you in our portfolio unless you ask us
        not to.
      </p>

      <h2>6. Results</h2>
      <p>
        We work hard to grow your reach and enquiries, but social media platforms control their own
        algorithms, so we cannot guarantee specific numbers of followers, views or sales.
      </p>

      <h2>7. Liability</h2>
      <p>
        Our total liability to you under this agreement is limited to the fees you paid us in the 3 months
        before the claim. We are not liable for indirect losses such as lost profits. Nothing in this agreement
        limits liability for death or personal injury caused by negligence, for fraud, or for anything else
        that cannot legally be limited.
      </p>

      <h2>8. Data</h2>
      <p>
        We handle personal data as described in our <Link to="/privacy">Privacy Policy</Link>. Where we handle
        your customers’ personal data for you (for example when replying to comments), we do so only on your
        instructions, keep it confidential and secure, and delete it when the service ends.
      </p>

      <h2>9. General</h2>
      <p>
        This agreement, together with the package description, is the whole agreement between us. We may
        update it with 30 days’ notice by email. It is governed by the law of England and Wales, and the courts
        of England and Wales have jurisdiction.
      </p>

      <p className="legal-contact">
        Questions? Email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or call {BUSINESS.phone}.
      </p>
    </LegalPage>
  )
}

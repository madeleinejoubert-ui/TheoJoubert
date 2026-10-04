import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage.jsx'
import { BUSINESS, PRIVACY_UPDATED } from '../business.js'

export default function Privacy() {
  return (
    <LegalPage eyebrow="Privacy Policy" title="How we use your information" updated={`Last updated ${PRIVACY_UPDATED}`}>
      <p>
        {BUSINESS.tradingName} is run by <strong>{BUSINESS.trader}</strong>, a sole trader based in the United
        Kingdom. We are the data controller for the personal information described here. If you have any
        question about it, email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Free review and sign-up forms:</strong> your name, business name, email, phone, website, social media links, location, industry, budget and the package you choose.</li>
        <li><strong>Client portal:</strong> your login email and password (stored encrypted by our database provider), your brand colours, logo, tagline, the photos and documents you upload, your social media handles, and your approvals and feedback on posts.</li>
        <li><strong>Social media performance:</strong> follower, reach and engagement figures for the accounts we manage, collected through Metricool.</li>
        <li><strong>Payments:</strong> handled by Stripe. We see your name, email, plan and payment status, but never your full card number.</li>
        <li><strong>Emails and messages</strong> you send us.</li>
      </ul>

      <h2>Why we use it, and our legal basis</h2>
      <ul>
        <li>To reply to your enquiry and prepare your free review: <em>your consent</em> and our <em>legitimate interest</em> in responding to people who contact us.</li>
        <li>To provide the service, take payment and run your client portal: <em>performance of our contract</em> with you.</li>
        <li>To keep accounting and tax records: <em>legal obligation</em>.</li>
        <li>To draft post ideas with AI tools, which a person always reviews before anything is sent to you or published: <em>performance of our contract</em>.</li>
      </ul>
      <p>We do not sell your information and we do not use it for advertising profiles.</p>

      <h2>Who we share it with</h2>
      <p>Only with the service providers we use to run the business, under contracts that require them to protect it:</p>
      <ul>
        <li>Supabase: database, logins and file storage (servers in London, UK)</li>
        <li>Vercel: website hosting</li>
        <li>Stripe: card payments and subscriptions</li>
        <li>Metricool: scheduling posts and social media analytics</li>
        <li>Anthropic: AI drafting of post copy from your brand details</li>
        <li>IONOS: business email</li>
        <li>Google: file storage for content</li>
        <li>Fontshare: the fonts on this website, which means your browser requests them from Fontshare’s servers</li>
      </ul>
      <p>
        Some of these providers are based in, or use servers in, the United States or the European Union.
        Where your data leaves the UK we rely on UK adequacy regulations (including the UK–US data bridge) or
        the UK International Data Transfer Addendum to safeguard it.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Enquiries that don’t become clients: 12 months from your last contact.</li>
        <li>Client records, invoices and payment records: 6 years after the end of the tax year in which our work ended, as HMRC requires.</li>
        <li>Photos and documents you upload: deleted within 90 days of your service ending, unless you ask us to keep them.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We do not use advertising or tracking cookies. If you log in to the client portal, your browser stores a
        login token so you stay signed in. This is strictly necessary for the portal to work.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of your information, ask us to correct or delete it, object to or restrict how
        we use it, or ask for it in a portable format. Where we rely on your consent, you can withdraw it at any
        time. Email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> and we will reply within one month.
      </p>
      <p>
        If you are unhappy with how we handle your information, please tell us first. You also have the right
        to complain to the Information Commissioner’s Office at{' '}
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk</a> or on 0303 123 1113.
      </p>

      <h2>Changes</h2>
      <p>
        We will update this page if the way we use information changes, and tell clients by email about any
        significant change. See also our <Link to="/terms">Client Agreement</Link>.
      </p>
    </LegalPage>
  )
}

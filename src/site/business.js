// Single source for the business details and plans used by the sign-up
// flow and the legal pages.

export const BUSINESS = {
  trader: 'Theo Joubert',
  tradingName: 'Lantern Social',
  email: 'hello@lanternsocial.co.uk',
  phone: '+44 7305 261693',
  website: 'https://lanternsocial.co.uk',
}

// Bump when the Client Agreement text changes; stored against each sign-up.
export const TERMS_VERSION = '2026-10-04'
export const PRIVACY_UPDATED = '4 October 2026'

// Stripe Payment Links, one per plan. Set in Vercel as
// VITE_STRIPE_LINK_STARTER / _GROWTH / _PRO. When a link is missing the
// sign-up page still records the request and Theo sends a payment link.
export const PLANS = {
  starter: { name: 'Starter', price: 295, link: import.meta.env.VITE_STRIPE_LINK_STARTER },
  growth: { name: 'Growth', price: 495, link: import.meta.env.VITE_STRIPE_LINK_GROWTH },
  pro: { name: 'Pro', price: 795, link: import.meta.env.VITE_STRIPE_LINK_PRO },
}

// Stripe customer portal login link, where clients cancel or update their card.
export const BILLING_PORTAL_URL = import.meta.env.VITE_STRIPE_PORTAL_URL || ''

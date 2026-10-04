# Stripe setup for online sign-up

The site's sign-up flow is built and live: **Packages → Sign up → /signup?plan=…**.
The form records the client (name, business, email, plan, accepted Client Agreement
version and time) in the `leads` table, then sends them to a Stripe Payment Link.
Until the links exist, the form still records the sign-up and tells the client Theo
will email a payment link.

## 1. Use Lantern Social's own Stripe account

Create (or use) a Stripe account in Theo's name for Lantern Social, so payments,
statements ("LANTERN SOCIAL") and payouts go to his business bank account.
Do not use another business's Stripe account.

## 2. Create the three subscription products

Stripe Dashboard → Product catalogue → Add product, each **Recurring · Monthly · GBP**:

| Product | Price |
|---|---|
| Lantern Social – Starter | £295 / month |
| Lantern Social – Growth | £495 / month |
| Lantern Social – Pro | £795 / month |

## 3. Create one Payment Link per product

Payment Links → New → choose the product, then:

- **After payment:** redirect to `https://lanternsocial.co.uk/welcome`
- **Collect:** customer name, business name (optional field "Business name"), billing address
- **Terms of service:** require agreement (set the URL `https://lanternsocial.co.uk/terms`
  under Settings → Public details first)

## 4. Turn on the customer billing portal (how clients cancel)

Settings → Billing → Customer portal:

- Allow customers to **cancel subscriptions** → **At the end of the billing period**
  (this matches the Client Agreement: cancel before the next payment, no further charge)
- Allow updating payment methods
- Enable the **customer portal login link** and copy it

## 5. Add the links to Vercel

Vercel → lantern-social → Settings → Environment Variables (Production):

```
VITE_STRIPE_LINK_STARTER = https://buy.stripe.com/...
VITE_STRIPE_LINK_GROWTH  = https://buy.stripe.com/...
VITE_STRIPE_LINK_PRO     = https://buy.stripe.com/...
VITE_STRIPE_PORTAL_URL   = https://billing.stripe.com/p/login/...
```

Redeploy. The sign-up button then goes straight to Stripe with the client's email
pre-filled, and the `client_reference_id` on the Stripe payment matches the
`leads.id` row, so each payment can be traced to its signed agreement.

## 6. Email template for confirmations

Stripe sends receipts automatically. In Settings → Emails, turn on
"Successful payments" and "Upcoming renewals" so clients get a reminder before
each monthly payment, which supports the cancel-before-renewal promise.

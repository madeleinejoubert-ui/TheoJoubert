# Stripe: online sign-up (live)

Lantern Social is a trading division of **StoryC Ltd**, so it takes payments through
StoryC Ltd's Stripe account (`acct_1TdqYM74wtuPtRCO`, shown in Stripe as "Story-Canva").
Every Lantern Social object is tagged `metadata.brand = lantern_social` so it can be
filtered from the other StoryC divisions in reports.

Flow: **Packages → Sign up → /signup?plan=…** records the client (name, business, email,
plan, accepted Client Agreement version and time) in the `leads` table, then sends them
to the Stripe Payment Link with their email pre-filled and `client_reference_id = leads.id`,
so each payment traces back to its signed agreement.

## What is set up (live mode, 5 October 2026)

| Plan | Product | Price | Payment Link |
|---|---|---|---|
| Starter £295/month | `prod_VNsIX9Dvt2eoc6` | `price_1UN6XV74wtuPtRCOap3tpTIU` | https://buy.stripe.com/14AcMY26zd3mfNF5Jy08g07 |
| Growth £495/month | `prod_VNsIescmjxikL8` | `price_1UN6XX74wtuPtRCOS66uUvnX` | https://buy.stripe.com/4gMaEQdPh7J2fNFgoc08g08 |
| Pro £795/month | `prod_VNsIFGb0ICgRwN` | `price_1UN6Xa74wtuPtRCOcqtl77SC` | https://buy.stripe.com/9B66oA4eHaVedFxdc008g09 |

- Card statement descriptor: **STORYC LANTERN** (matches the other `STORYC …` divisions).
- Each link redirects to `https://lanternsocial.co.uk/welcome?plan=…`, collects an
  optional business name, and shows: "Lantern Social. Billed monthly. No minimum term:
  cancel any time before your next payment." Checkout deliberately names only Lantern
  Social, not StoryC Ltd: the Stripe account is currently registered as an individual,
  so a company name should only appear once the account is moved to the company.
- **Customer portal** `bpc_1UN6ZT74wtuPtRCOEAh1Y697` ("Lantern Social client billing"):
  cancel **at the end of the billing period** (no refund for the month already started),
  update card, update contact details, invoice history. Plan switching is off.
  Login link: https://billing.stripe.com/p/login/bJeaEQeTl6EY30T1ti08g00
  - Note: this is currently the account's *default* portal, because StoryC had none
    before. If another division needs a portal, create it as its own configuration.

Vercel (`lantern-social`, all environments) holds `VITE_STRIPE_LINK_STARTER`,
`VITE_STRIPE_LINK_GROWTH`, `VITE_STRIPE_LINK_PRO` and `VITE_STRIPE_PORTAL_URL`.
They are baked in at build time: redeploy after changing them.

## Still to do in the Stripe Dashboard

1. **Settings → Emails:** turn on "Successful payments" and "Upcoming renewal reminders"
   so clients are reminded before each monthly payment (supports the cancel-before-renewal promise).
2. **Settings → Customer emails → Include a link to the customer portal** in receipts,
   so the "billing link in your confirmation email" in the Client Agreement exists.
3. **VAT:** prices are created with no tax behaviour set. Once StoryC Ltd's VAT position for
   this service is confirmed, either leave as-is (not registered) or enable Stripe Tax and
   decide whether the £ prices are VAT-inclusive.
4. Run one live £295 sign-up with a real card and refund it, to confirm the redirect to
   /welcome and the receipt email.

## Changing a price later

Create a new Price on the same product, create a new Payment Link for it, update the
Vercel variable, redeploy, then deactivate the old link. Existing subscribers stay on
their current price until moved.

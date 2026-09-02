# Becoming Self-Employed in the UK — Theo's Launch Checklist

A step-by-step plan for standing up a freelance social media management business
(Metricool-based, building on the Owl Schoolhouse experience). Work top to bottom;
the phases are roughly in dependency order.

> This is a practical checklist, not legal or tax advice. For anything with money
> or legal consequences, confirm current rules on [GOV.UK](https://www.gov.uk) or
> with an accountant.

---

## Phase 1 — Legal & tax foundations (week 1–2)

- [ ] **Choose a trading structure.** Start as a **sole trader** (simplest: register once,
  file one Self Assessment a year, keep all profit after tax). Consider a limited company
  later once income is steady (~£30k+ profit) or clients require it.
- [ ] **Register as self-employed with HMRC.** Do this via
  [gov.uk/register-for-self-assessment](https://www.gov.uk/register-for-self-assessment).
  Deadline: 5 October following the end of the tax year in which trading started.
  You'll receive a **UTR (Unique Taxpayer Reference)** — keep it safe.
- [ ] **Choose a trading name** (e.g. "Theo Joubert Social" / "Theo Social Studio").
  Check no one else in the space uses it, and that the domain and social handles are free.
- [ ] **Know the tax basics:**
  - Personal allowance, then Income Tax on profits (20% basic rate band).
  - **Class 4 National Insurance** on profits above the threshold (Class 2 is now
    treated as paid for most self-employed people — verify current-year rules).
  - **VAT registration is only mandatory past the threshold** (£90,000 turnover on
    current rules) — not a day-one concern, but monitor turnover.
  - **Making Tax Digital for Income Tax**: check the current phase-in threshold — from
    April 2026 it applies to self-employed income over £50,000, with lower bands
    following. Digital record-keeping from day one makes this a non-event.
- [ ] **Set aside tax as you earn.** Move **25–30% of every invoice** into a separate
  savings pot. Remember **payments on account** in year two (HMRC asks for the next
  year's tax in advance, in two instalments — the classic year-two cash-flow shock).
- [ ] **If leaving employment:** check the employment contract for non-compete or
  IP clauses, and keep the P45 for the Self Assessment.

## Phase 2 — Money & admin (week 1–3)

- [ ] **Open a business bank account.** Sole traders can legally use a personal account,
  but a separate one keeps records clean. Starling, Monzo Business, Tide and Mettle are
  free and popular with freelancers.
- [ ] **Bookkeeping from day one.** FreeAgent (free with some bank accounts),
  QuickBooks Self-Employed, or Xero. Log every invoice and expense; photograph receipts.
  The `invoices` table in this platform records who owes what — the accounting app is
  the tax record.
- [ ] **Get insured:**
  - **Professional indemnity insurance** — essential when managing clients' brands and
    ad spend (a wrong post can cause real damage). ~£8–15/month.
  - **Public liability** — often bundled, needed if visiting client premises.
  - **Cyber insurance** — worth considering since the business holds client account access.
- [ ] **Register with the ICO** (Information Commissioner's Office). Handling client
  customer data and running social accounts almost certainly requires the **data
  protection fee** (£40–52/year for small businesses): [ico.org.uk](https://ico.org.uk).
- [ ] **Contract template.** A short services agreement covering: scope (platforms,
  posts/month), monthly fee and payment terms (14 days), content approval process,
  who owns created content, access/passwords handling, notice period (30 days),
  and liability cap. Free UK freelancer templates: IPSE, or a solicitor one-off review.
- [ ] **Invoice essentials** (legally required bits): name and business address, invoice
  number, date, client details, description, amount. Add bank details and payment terms.

## Phase 3 — Tools & platform (week 2–4)

- [ ] **Metricool plan.** The free tier covers one brand; managing multiple clients needs
  **Advanced or a Teams plan** — the cost is passed through in pricing. Connect each
  client's channels into their own Metricool "brand".
- [ ] **This platform** (the repo you're looking at):
  - Supabase project **theo-social-studio** (London region) is live — database for
    clients, content calendar, Metricool analytics snapshots, invoices, and website leads.
  - Deploy the app free on **Vercel** or **Netlify** (see `docs/SETUP.md`).
- [ ] **Domain and email.** Buy the domain (~£10/year), set up **Google Workspace**
  (~£5/user/month) or Zoho Mail for a professional address — no Gmail addresses on invoices.
- [ ] **Password manager** (Bitwarden/1Password). Never store client social passwords in
  notes or spreadsheets; where possible use platform roles (Meta Business Suite partner
  access, LinkedIn page admin) instead of shared passwords.
- [ ] **Supporting tools** already known from Owl Schoolhouse: Canva Pro for design,
  CapCut for short video, ChatGPT/Claude for copy drafts, Google Drive for client assets.

## Phase 4 — Offer & first clients (week 3–6)

- [ ] **Lock the packages.** Three tiers are seeded in the platform (edit to taste):
  Starter £295/mo, Growth £595/mo, Premium £995/mo, plus a £450 one-off audit.
  Rule of thumb: price so that 4–6 clients replace the target salary.
- [ ] **Portfolio: lead with Owl Schoolhouse.** Build one strong case study — before/after
  follower and engagement numbers straight from Metricool, three best-performing posts,
  a testimonial. One real case study beats a speculative portfolio.
- [ ] **Update LinkedIn** to the new positioning ("Freelance Social Media Manager —
  helping [niche] grow on Instagram & TikTok"), and post the founding story.
- [ ] **Pick a niche** to start (e.g. education/tutoring businesses, given the Owl
  Schoolhouse background — the credibility transfers directly).
- [ ] **First-clients plan:** tell the personal network directly (most freelancers get
  client #1 this way), offer the audit as a low-risk entry product, and approach
  5 local/niche businesses per week with one specific observation about their socials.
- [ ] **Website live** with services, case study, and the contact form wired to the
  `leads` table (leads then appear in the app dashboard).

## Phase 5 — Operating rhythm (ongoing)

- [ ] **Weekly:** content planned in the calendar → scheduled in Metricool → community
  management daily; check new leads and reply same day.
- [ ] **Monthly:** Metricool report per client (record the numbers in `analytics_snapshots`
  so history builds up), invoice on the 1st, chase at day 14; reconcile bookkeeping.
- [ ] **Quarterly:** review pricing and capacity; put aside tax; check turnover vs the
  VAT threshold; back up client asset drives.
- [ ] **Yearly:** Self Assessment (file well before 31 January — ideally by autumn so the
  tax bill is known months ahead); renew ICO fee and insurance; review whether it's time
  to incorporate as a limited company.

---

## Quick reference — the official registrations

| What | Where | When | Cost |
|---|---|---|---|
| Self Assessment registration | gov.uk/register-for-self-assessment | By 5 Oct after first tax year of trading | Free |
| ICO data protection fee | ico.org.uk | Before handling personal data | ~£40–52/yr |
| VAT registration | gov.uk/vat-registration | Only past ~£90k turnover | Free |
| Business bank account | Starling / Monzo / Tide | Week 1 | Free |
| Professional indemnity insurance | PolicyBee, Superscript, Markel etc. | Before first client | ~£8–15/mo |

## Rough monthly running costs at launch

| Item | Est. cost |
|---|---|
| Metricool (multi-brand plan) | ~£40–90/mo depending on tier |
| Supabase (this platform) | $10/mo (current org plan) |
| Domain + professional email | ~£6/mo |
| Insurance | ~£10–15/mo |
| Canva Pro | ~£10/mo |
| Bookkeeping app | £0–15/mo |
| **Total** | **~£80–140/mo** |

First client at £295/mo more than covers the entire cost base.

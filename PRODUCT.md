# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary customer (owner-confirmed, 2026-08-05): DACH/Swiss export.** Small and
mid-sized companies in Switzerland, Germany and Austria buying custom software
and integration work cross-border from a Kosovo-based supplier. This is the
segment the delivered archive actually reflects — Spitex Schwab AG (Swiss
home-care), Stolzbau GmbH — rather than the sector-neutral audience the current
site copy addresses.

The buyer already runs real systems; this is not greenfield work. Integration
copy assumes an existing "CRM, ERP, online store, accounting software, and
business apps" (`content/system-integration.ts:6-7`); CRM copy assumes a company
managing information "across spreadsheets, emails, documents, and individual
employee notes" (`content/crm-solutions.ts:25`).

Two roles appear in the worked examples and both are real buyers:

- **Management** — wants visibility: weekly automatic summaries of leads,
  opportunities, sales, overdue follow-ups, and what is delayed.
- **The operational employee** — doing the repeated work that the system does
  not currently absorb.

Greenfield founders are addressed in exactly one line of Custom Software copy
(`content/custom-software.ts:116`) and are **not** a segment.

**Industries — unresolved conflict.** The shipped site names seven (Finance,
Healthcare, Manufacturing, Automotive, Retail, Logistics, Public Sector,
`content/home.ts:192-235`). The owner's earlier IA document names five, omitting
Retail and Logistics. Two owner sources disagree; this has never been settled.
The descriptors claim *applicability* only — no engagement in any sector is
claimed anywhere on the site.

## Product Purpose

Mardal's own marketing site for a B2B technology services company. There is no
consumer offer, no self-serve product, no account system and no pricing. Its
only job is to produce inbound enquiries.

Stated proposition, used as both the meta description and the hero support line:
**"We build the technology behind your growth."** Site title and tagline:
"Mardal — Innovation lives here", rendered as the H1 "Innovation / lives here."

Core self-description (`content/home.ts:93-94`): "We help your business work
better by building and connecting the technology you use every day, from AI and
automation to CRM, custom software, web platforms and apps. Everything is shaped
around your team, your processes and the way your business actually works."

Success is a qualified enquiry from a DACH/Swiss SME. Nothing about visitor
behaviour is currently measurable — see Capabilities and Constraints.

## Positioning

**Owner decision, 2026-08-05: the integration thesis is adopted as the live
position, including its hard commitments.** It was drafted on 2026-07-27 and had
never reached the code — verified by grep at HEAD `5c42434`, zero matches for
`cutover|assessment|two-week|fixed price|rollback` across `content/`, `app/` and
`components/`. Adopting it supersedes the shipped "one partner instead of many"
framing, which any agency could claim truthfully.

**Thesis: most failures happen between systems, not inside them.**

Four positions, each a mechanism a competitor could not copy without lying:

1. **Scope is bounded before it is built, and written as exclusions.** What is
   not in phase one is stated before work starts.
2. **Migration is the project.** The pre-migration state is kept and remains
   restorable — moving the data is the engagement, not a step in it.
3. **The client owns source, schema and deployment pipeline from the first
   commit.** Not at handover. From commit one.
4. **Permissions are decided at design time**, not retrofitted after launch.

**Binding delivery commitments.** These are now product commitments, not copy.
The source document warns that a hedged version is worse than silence: they hold
on every engagement or they are deleted outright.

- Fixed price for phase one.
- Two-week increments against a live, client-accessible environment.
- Day-one repository access.
- Cutover rehearsed against a copy of production data, with a timed rollback
  path.

**Engagement model:** three stages — Assessment → Build → Cutover.

Surviving positions from the shipped copy that the thesis does not contradict:

- **AI is process-first, not model-first** — understand how work moves through
  the business, then build automation that fits that process
  (`content/ai-automation.ts:14-19`).
- **CRM is a whole-business record system, not a sales tool**
  (`content/crm-solutions.ts:123`).
- **The three in-house products are R&D that feeds client work**, not a revenue
  line: "Products are / how we test / our thinking" (`content/home.ts:243-245`).
  Whether any is intended to be sold is undecided.

**Not yet implemented.** The adopted thesis renames the service "CRM Solutions"
to **"CRM Systems"** (the shipped name uses a banned filler word). The site
still ships the old name in navigation, homepage boxes and the route folder.

## Operating Context

**Company.** A registered Kosovo company (owner-confirmed 2026-08-05). Company
form, registration number and jurisdiction detail have not been supplied — see
open decisions. Mardal predates this site under a different identity: in 2025 it
traded as a marketing agency selling branding, webshop, social media, AI chatbot
and print work. Whether that identity is retired or still trades alongside the
software business is undecided.

**Team.** A small permanent core, roughly 2–5 people, with real roles that may
be published (owner-confirmed 2026-08-05). Names and roles have not yet been
supplied, so no Team page or role list can be written until they are. The
repository is not evidence about company size: 300 of 300 commits are by one
author (Kushtrim Arifi), 2026-07-24 to 2026-08-05.

**Contact details — real, owner-supplied, verified in code as such:**

- `info@mardal.co`
- `+383 49 210 999`
- Rr. "Isa Boletini", 6000 Gjilan, Kosovo

**Language: English only, and deliberately so** (owner decision, 2026-08-05).
There is no i18n layer, no locale routing, no hreflang and no language switcher;
`lang="en"` is hard-coded. This is a recorded constraint, not an oversight —
future work must not add localisation on the assumption it was forgotten. Note
the tension on record: the primary customer is German-speaking.

**Never deployed.** This repository has never shipped. No CI, no deploy script,
no root `wrangler.toml`. Two hosting paths are half-wired and neither is chosen:
direct Cloudflare Workers, and an OpenAI hosting control plane
(`.openai/hosting.json`, D1 and R2 both null). Do not state that `mardal.co`
serves this site.

**Repo facts.** Project directory is `Desktop/Mardal websitess ` — **with a
trailing space**. `Desktop/Mardal website` (no trailing `s`) is a dead scaffold
holding only an orphan `node_modules`. Remote is
`github.com/Kushtrima/mardal-website.git`.

## Capabilities and Constraints

**The offer is exactly five services**, named identically in navigation,
homepage boxes and route folder names: AI & Automation, System Integration, CRM
Solutions (to be renamed CRM Systems), Custom Software, Web Platforms & Apps.

48 named capabilities exist, unevenly distributed — CRM 18, AI & Automation 12,
System Integration 9, Custom Software 9, **Web Platforms & Apps 0**.

- **Custom Software is organised by client intention**, not technology: build
  for employees, build for customers, or improve software that already exists.
  Entry trigger is packaged software failing.
- **Strictly vendor-neutral.** The only third-party products named anywhere are
  communication surfaces (email, WhatsApp, SMS, calendars, Teams, Slack). No
  CRM, ERP, cloud or AI vendor is ever named; CRM selection is advisory.
- **RAG carries two explicit commitments**: source attribution, and reduced
  unsupported answers. MLOps is offered but deliberately glossed in plain
  English.

**Three in-house products, all "In development":** Arvena AI (mental health,
2025), Ihrauto (automotive, 2024), Ftesa.co (events, 2026). The Year field's
meaning — started or due — is explicitly undefined and must not be restated as a
founding or launch date. Whether these are commercial or purely method proof is
undecided; product IP ownership relative to the company is unrecorded.

**Technical constraints:**

- Web only, server-rendered. Next.js 16 App Router + React 19 RSC, compiled by
  vinext on Vite 8, shipped as a Cloudflare Worker. Node ≥ 22.13. No native,
  mobile-app, Expo, Capacitor or PWA surface.
- **No CMS.** All copy lives in typed TypeScript modules under `content/` by
  house rule, so every wording change is a code edit, a build and a deploy —
  performable only by someone with repo access.
- **No conversion instrument except `mailto:` and `tel:`.** No form, no input of
  any kind, no booking link, no lead capture, no backend, no API route, no
  `fetch()` in application code.
- **No analytics, tag manager, consent script or error monitoring**, and no SEO
  surface: no sitemap, robots, canonical, `metadataBase`, or OG/Twitter
  metadata.
- A database is scaffolded but deliberately unused and unreachable: Drizzle +
  Cloudflare D1, empty schema, zero migrations, binding null.
- **Six routes exist**: `/` plus five `/services/*`. `/about` and `/contact`
  return 404. No products, solutions, case-studies, blog, careers, privacy,
  terms or cookies route, and no custom 404 page.

**Known broken or incomplete at time of writing:**

- `/services/web-platforms-apps` is a hero-only stub and the one page that
  renders no footer — contact details, nav columns and the `#contact` anchor do
  not exist on that route, so the header CTA is dead.
- Navigation promises roughly four times more site than exists: 8 of 20 fragment
  links dead on the homepage, 18 of 24 on any service page.
- `npm test` fails 2 of 5 on HEAD (stale assertions for renamed copy); two
  service routes have no coverage; `tsc --noEmit` reports 9 errors.
  `ProcessSection.tsx` still imports a content export that was deleted.
- The only published delivery process is one sentence. A three-step "How we
  work" section was built and its content removed. **This gap is now material:**
  the adopted Assessment → Build → Cutover model has nowhere to live.

**Legal blockers.** Privacy, Terms and Cookies are deliberately dead anchors
because the pages do not exist. Until they do, no contact form and no analytics
can be added lawfully — which matters more now that the primary customer is in
the EU/Switzerland. GDPR posture and data-hosting location are undecided.

## Brand Commitments

**Never invent facts** — an explicit written house rule that the codebase
demonstrably obeys. Social icons render as non-clickable marks because "a
guessed profile URL is worse than a mark that waits for one"; legal links are
dead anchors rather than invented URLs; product images are declared stand-ins
rather than claimed screenshots. Write `[City]`, `[X] hours`, `[founder name]`
and leave the bracket unfilled.

**Banned filler words** (prose only): solutions, seamless, empower, leverage,
cutting-edge, innovative, robust, journey, unlock, elevate, transform,
ecosystem, streamline, end-to-end, best-in-class, world-class, bespoke.
"Solutions" survives as fixed nomenclature in the nav label and the service name
— which is precisely why the adopted position renames it.

**Voice is plain, direct capability statement.** Analogies and storytelling are
a recorded rejection: "Somebody retypes it on a Monday morning" was rejected as
unprofessional. State the capability directly.

**Fixed CTA vocabulary in use:** "Hire us" (header), "Start a project" (mobile
menu), "Let's build" (service heroes), "Get in touch" (service CTA blocks),
"Explore more" (product cards), "Explore" (industries). The product cards said
"Get in touch" until the owner changed them on 2026-08-09; their link is still
`mailto:info@mardal.co`, so "Explore more" opens an email client rather than
going anywhere — none of the three products has a page to go to.

**Spelling convention is unchosen** — shipped copy mixes British and American
("fulfilment", "labour" alongside "organize", "analyze", "personalize"). Pick
one before the next copy pass.

Visual and typographic commitments live in `.claude/skills/mardal-design/` and
`app/globals.css`, not here.

## Evidence on Hand

**Real delivered work, now clearable for use** (owner-confirmed 2026-08-05:
these engagements may be named and described as Mardal's work):

- **EN NUR** — Laravel membership system: multi-role auth, Stripe / PayPal /
  TWINT / bank transfer, PDF receipts, automated renewals. The strongest
  concrete artefact available.
- **Spitex Schwab AG** — Swiss healthcare, live domain, managed hosting.
  Directly on-segment for the DACH primary customer.
- **Stolzbau GmbH**, **Henor**, ANDI SPORT, ZEN, Jetonikeramika.

Attribution needs restating: the owner's personal portfolio presents this work
as Kushtrim's own — of 17 case studies only 3 mention Mardal at all, none in an
attribution line. Moving it under Mardal is now authorised; per-client sign-off
for public naming has not been separately recorded.

**What does not exist, and must never be invented:**

- No client logo, testimonial, or named reference on the site today.
- **Zero quantified claims** anywhere — no years in business, headcount, project
  count, uptime, or SLA figure. The earliest datapoint is Kushtrim joining
  Mardal in 2018, which is *not* a founding date.
- Every scenario on every service page is an unattributed hypothetical, labelled
  "example" in the data. None is a client story.
- No product has an interface worth showing. The three product images are stock
  photographs used as declared stand-ins, hot-linked from `images.unsplash.com`
   — the site's only external runtime dependency.
- The navigation promises an "ArvenaAI" case study pointing at a non-existent
  anchor, for an unreleased in-house product. It must never be written as a
  delivered client outcome.
- A compliance claim ("Full AI Act compliance", "Secure vector databases")
  was removed from live copy and survives only in a stale test. Do not restore
  it from the test file; current copy claims only "regulatory readiness".
- No named vendor, platform, partnership or certification relationship.
- No price, rate, range, minimum, or "from" figure — except the now-committed
  "fixed price for phase one", which is a model, not an amount.
- Social accounts are said to exist but their URLs were never supplied.

## Product Principles

1. **Never invent a fact.** A page with a gap beats a page with a plausible
   guess. Brackets stay unfilled until the owner fills them.
2. **Sell the seam.** The failure is between systems, not inside them.
   Migration, ownership, permissions and cutover are the argument — not the
   breadth of the service list.
3. **Bound scope by writing exclusions.** State what phase one does not include
   before building it.
4. **The client owns their system from the first commit** — source, schema,
   deployment pipeline. Not at handover.
5. **Recommend, never resell.** Platform advice stays vendor-neutral; no
   partnership or certification is claimed.

## Accessibility & Inclusion

No formal WCAG target has been set, but accessibility is treated as a build
constraint and largely met: `lang` set, one `h1` per page enforced by test,
`aria-labelledby` on every section, `inert` + `aria-hidden` on closed menus,
Escape closes and restores focus, `aria-current` on active links, `aria-live`
polite for changing service titles, alt text with explicit dimensions, a global
`focus-visible` ring, and visually-hidden section headings — 92 `aria-*`
attributes across `app/` and `components/`.

`prefers-reduced-motion` is honoured in both layers: a CSS block neutralises
transitions and animations, and 13 separate JS sites check `matchMedia` before
starting any GSAP effect.

Colour contrast is an explicit decision with a recorded measurement — a separate
darker accent token exists for small text because the primary accent measures
4.12:1 against the page background.

**Known gaps:** no skip-to-content link; no stated WCAG target; no automated
accessibility check; a capture-phase window `keydown` listener on service pages
whose keyboard behaviour has never been verified; no dark mode or theming.

## Open Decisions

Explicitly undecided. Do not resolve these by inference.

- **Team names and roles** — a core of ~2–5 is confirmed and publishable, but
  who they are has not been supplied.
- **Company form, registration number, jurisdiction detail** — the entity is
  confirmed registered in Kosovo; the specifics are not recorded.
- **Whether the 2025 marketing-agency identity is retired or still trades.**
- **Industries: seven or five.** Two owner sources disagree.
- **Whether the three products are commercial or purely method proof**, which is
  closest to shipping, and whether their IP sits with the company.
- **Commercial model beyond phase one** — "fixed price for phase one" is now
  committed; whether ongoing involvement is retained, paid, or included is not.
- **GDPR posture and data-hosting location**, now that the primary customer is
  in the EU/Switzerland.
- **Spelling convention** — British or American.
- **Hosting target** — Cloudflare Workers direct, or the OpenAI control plane.

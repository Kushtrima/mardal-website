# Mardal SEO plan: Kosovo, Switzerland, Germany

Draft for the owner's approval, 11 October 2026.
Built from four inputs:
- An audit of the live site (mardal.vercel.app, commit 45af62d).
- Three research reports: Switzerland and Germany; Kosovo and the Albanian-speaking diaspora; Google's rules for 2026 and the technical setup.

Sources are listed at the end. No search-volume tool was used, so demand is shown as Google Trends indices and Google autocomplete evidence. Exact volumes come later, from Google Keyword Planner (step 0.9).

In every step, **You** = the owner and **Me** = the developer (Claude). Nothing below is built until you approve section 0.

**Status, 11 Oct 2026** (owner: "execute the plan", then "make it what is best", "English first then De and AL", "i just want to be SEO PERFECT"):
- **Done and committed** (local only, not deployed):
  - `fae271d`: canonicals, share pictures and the launch switch (1.1, 1.3)
  - `90d4b8b`: titles and descriptions (1.4)
  - `6be27c6`: structured data (1.5)
  - `e3f4cac`: screenshot descriptions (1.6)
  - `1edcac1` and `4043666`: speed (1.7). On a throttled phone the main content of most pages shows in 0.8–0.9 s, the homepage in 2.6 s.
  - `b6f89d5`: postcode 60000 and founding year 2026
  - `d159ca8`: five service pages (2.1)
  - `a98ffc7`: Nearshoring from Kosovo in English (2.5)
  - `11849d8`: internal links (2.4)
- **Waiting on you:**
  - German and Albanian reviewers (Phase 3–4)
  - the legal name and registration for the legal notice
  - the data-protection position
  - DNS for launch, then the accounts: Search Console, Bing, Google Business Profile, directories
- **Sample projects:** they come out on launch day, together with turning the switch in `lib/launch.ts`.
---

## 0. Your decisions, needed before we start

Each decision comes with my recommendation.

### 0.1 Launch the site on mardal.co
Nothing ranks while the site lives on mardal.vercel.app and is marked "noindex".
- **Recommended:** yes, as soon as section 0 is answered.
- **You:** point the domain's DNS to Vercel.
- **Me:** do everything else (step 1.1).

### 0.2 Languages
On 2026-08-05 you decided the site is English only. The research says that stops us ranking in Switzerland and Germany:
- **Swiss and German buyers search in German.** In Google Trends, "Webagentur" scores 10 against 1 for "web agency" in Switzerland, and 6 against 3 in Germany.
- **People in Kosovo search in everyday Albanian** ("web faqe kosove", "webfaqe prishtine"), and search for software in English.
- **Recommended:** keep English as the main version.
  - Add German (Swiss spelling first: "ss", CHF, Offerte, KMU) for the home page, services, case studies and nearshoring.
  - Add Albanian for the home page, services and Jetonikeramika.
- **You:** decide, and say who checks the German and Albanian text. I can draft translations, but a native speaker approves every line.

### 0.3 A Swiss domain
.co is a generic domain, so it says nothing about Switzerland. In a sample of Swiss results, 39 of the 45 top-9 results were .ch or .swiss. mardal.ch looks unregistered (confirm at nic.ch); mardal.de is taken by someone else.
- **Recommended:** register mardal.ch now and redirect it to mardal.co/de/. One site keeps all the strength in one place, which suits a small team. A separate Swiss site can come later.
- **You:** register mardal.ch.

### 0.4 Only real clients at launch
The Clients page lists 8 invented companies and an example project page ("Solvei", whose description is still a bracketed placeholder). The About page also mixes 23 invented names with the real archive. Google's trust guidance treats invented clients as deception, and PRODUCT.md already says they must not ship.
- **Recommended:** remove them all before launch. Show the 3 real projects, then add more real ones from your portfolio (step 3.3).
- **You:** say which archive clients may be named. PRODUCT.md clears the names, but each client's consent is yours to confirm.

### 0.5 Company facts, used the same way everywhere
These facts go on the About page, the legal notice, the structured data, the Google Business Profile and every directory listing:
- the legal name exactly as registered in ARBK, and the registration number
- the founding year
- the real team: names, roles and photos (no stock or AI faces)
- languages spoken: EN, DE, SQ
- markets served

**The postcode:** the footer says "6000 Gjilan", but Kosovo postcodes have 5 digits and Gjilan's is **60000**.
- **You:** confirm the postcode and send the rest of the facts.
- **Me:** fix the postcode and use the facts everywhere.

### 0.6 Legal notice (Impressum) and data protection for DACH clients
- **The legal notice:** a legal notice page is required for sites aimed at Germany (§5 DDG) and Switzerland (UWG Art. 3(1)(s)).
- **Data protection:** Kosovo is not on the EU's or Switzerland's list of countries with adequate data protection. Serious DACH clients, and especially health clients like Spitex, will ask how their data is protected.
- **Recommended:** add a legal notice page and a short trust page, covering:
  - a data-processing agreement with standard contract clauses
  - where data is hosted (CH/EU)
  - the list of sub-processors
  - the reply time
- **You:** approve what it says.

### 0.7 Prices
Swiss and German competitors show "ab CHF 2'000" or "Fixpreis" in their page titles, and Swiss searches like "Website erstellen lassen Preis" are rising sharply. Nothing like this appears on Mardal today.
- **You:** decide whether to show from-prices or ranges.

### 0.8 Accounts and memberships that only you can open
- the Google account for Search Console and the Business Profile
- Bing Webmaster Tools
- the LinkedIn company page
- STIKK membership (BASIC, €150 a year)
- free directory profiles (see 5.2)

### 0.9 Exact search volumes (optional)
- **You:** a Google Ads account with no spending unlocks Keyword Planner volumes for CH, DE and XK.
- **Me:** turn those volumes into the final keyword map.

### ⏰ Time-sensitive
The German-Kosovar Economic Forum runs 28–29 Oct 2026 in Pristina and includes meetings with German companies. **Registration closes 18 October** (b2match).

---

## 1. Where the site stands (audit, 11 Oct 2026)

**Blocks ranking today:**
- The site is not on mardal.co.
- robots.txt disallows every crawler, and the preview sends `X-Robots-Tag: noindex`.
- No canonical tags on any page.
- No `metadataBase`, so share images point at mardal.vercel.app.
- Invented clients on the Clients and About pages (see 0.4).

**Weak:**
- **Generic titles and descriptions**, with no service or place words:
  - "Services — Mardal" / "The services Mardal offers, in one place."
  - "Clients — Mardal"
  - The home page: "Mardal — House of Creativity & Technology" / "We build the technology behind your growth."
- **No structured data** (JSON-LD) anywhere.
- **All 19 services on one page** (/services, one URL), so no service can rank on its own.
- **No image descriptions.** Every case-study screenshot has an empty `alt`: 17 per project page, 11 on the Clients page.
- **Thin pages:** Clients 88 words, Blog 57, Contact 78.
- **The same share image on every page.**
- **No links** between services, case studies and blog posts.
- **Slow main content on a throttled phone** (4× CPU, 1.6 Mbit/s), measured as LCP; Google's "good" is ≤ 2.5 s:

| Page | LCP |
|---|---|
| home | 3.4 s |
| /services | 3.7 s |
| /case-studies | 5.0 s |
| EN NUR | 2.5 s |

  The two slow headings stay hidden until their animation script splits them into words, which pushes LCP back. Layout shift is 0 everywhere, and scripts are about 220 KB.

**Strong:**
- static pages
- a sitemap, a 404 page and per-page titles
- three real case studies, each with situation, challenge, research and solution, live links and real screenshots
- a fast, stable layout apart from those two headings

---

## 2. What the research found

### Switzerland and Germany
**Search engines:** Google has 80.2% of search in CH and 87.8% in DE; Bing has 12.1% in CH, so it is worth setting up too (StatCounter, Sep 2026).

**Language:** buying searches are in German. The Swiss wording to use:
- Webagentur / Webdesign
- KMU
- Offerte
- Website (not Webseite)
- "ss", never "ß"

**Competition:**
- **High:** "Webagentur Zürich", "Website erstellen lassen" (DE: IONOS, Strato, ads) and "CRM für KMU" (software vendors). These are long-term targets.
- **Medium, winnable:**
  - "Laravel / WordPress / Shopify Agentur Schweiz"
  - "App entwickeln lassen"
  - "n8n Agentur" and chatbots for companies (n8n interest in CH: index 52 in the last 12 months against 17 over 5 years)
  - "Website für Pflegedienst" (DE)
- **Low (fast wins):**
  - **"Spitex Website":** one specialist, and agencies' own project pages rank.
  - **TWINT payments for associations:** no agency ranks.
  - **"Nearshoring / IT Outsourcing / Softwareentwicklung Kosovo":** weak results pages. Mardal could rank in weeks, but few people search these terms.

**Competitors on the Kosovo terms:**
- outwork.ch (Swiss, with a Pristina office), kutia.net, syncore.biz, entriks.com, ocasolutions.ch and space-agency.ch.
- Their pattern: German copy, client logos, case studies; few prices.

**AI summaries:** Google's AI summaries appeared on 31 of 37 sampled results pages. AI tools often cite directories such as Clutch when asked "which agency".

### Kosovo
- **Google** has 96% of search; 69–85% of traffic is mobile.
- **Searches use everyday spelling without ë.** "web faqe", "webfaqe" and "faqe interneti" are what people type ("uebfaqe" barely appears). Software searches are in English: "software development company in kosovo", "it company kosovo".
- **Only Prishtina appears as a city.** Gjilan has no competitor in the results: a free local opportunity with a Google Business Profile.
- **Competitors** are Albanian-first, with exact-match titles: flutra.com, uebfaqe.com, webfaqe.cc, hostinkos.com, porositweb.com. English searches are owned by directories (Clutch/The Manifest, GoodFirms, TechBehemoths).

### The diaspora
- **Size:**
  - Germany: 323,260 Kosovo nationals.
  - Switzerland: 116,865 Kosovo nationals, and about 300,000 people of Albanian origin.
- **Businesses:** more than 6,000 Albanian-origin firms in German-speaking Switzerland; swissalbs has 650 member firms; the German-Albanian UNION has about 450–600.
- **They search in German, not Albanian.** Albanian works as the language you serve them in and for word of mouth, not as an SEO channel.
- **The gap:** competitors offer the diaspora only web design and hosting. Nobody offers software, apps or AI.

### Google in 2026
- **Trust comes first.** Google trusts a real, identifiable company, named clients, dated results and reviews on other sites.
- **Off limits:**
  - city "doorway" pages (copies per city)
  - mass AI-written pages
  - sitewide footer links used for ranking
- **AI search** (Overviews and AI Mode) is live in CH, DE and XK. Google says no extra steps are needed: AI results draw on the same ranking systems.
- **FAQ and HowTo rich results are gone.** Structured data still helps Google understand the company.
- **Speed:** "good" Core Web Vitals are LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1.
- **A new domain:** brand searches and niche phrases can rank in weeks to months. Big terms take many months to years, with no guarantee.

---

## 3. Strategy

**One sentence, used the same way everywhere:**
> Mardal — digital agency for Switzerland, Germany and Kosovo: websites, custom software and AI automation.

**Three pillars:**
1. **Be a company Google and clients can trust.** That means facts, the real team, real named clients, a legal notice, data protection, reviews and directory profiles.
2. **Win the niches we can win fast:**
   - Kosovo nearshoring for DACH companies
   - Albanian-run SMEs in CH and DE (in German)
   - websites for Spitex and care providers
   - associations and mosques with membership and TWINT/Stripe payments
   - Laravel / custom software
   - n8n and AI automation for KMU
   - "web faqe" and the local pack in Gjilan
3. **Grow toward the big terms** with German service pages, more case studies and links built over months.

### Keyword map (page ← searches)

| Page | Language | Main searches |
|---|---|---|
| Home | EN / DE / SQ | Mardal; digital agency Switzerland Kosovo; Digitalagentur für KMU; web faqe Kosovë |
| Websites | EN / DE / SQ | Webdesign Agentur Schweiz; Website erstellen lassen (Preis); webfaqe profesionale; web faqe Gjilan |
| Custom software & web platforms | EN / DE | Individualsoftware entwickeln lassen; Laravel Agentur Schweiz; software development company Kosovo |
| Mobile apps | EN / DE | App entwickeln lassen (Kosten) |
| E-commerce | EN / DE / SQ | Shopify Agentur Schweiz; dyqan online Kosovë |
| CRM | EN / DE | CRM Einführung KMU |
| AI & automation | EN / DE | n8n Agentur Schweiz; KI Automatisierung KMU; Chatbot für Unternehmen / WhatsApp |
| UX/UI & branding | EN / DE / SQ | UX Agentur; logo dizajn |
| Nearshoring Kosovo | EN / DE | Nearshoring Kosovo; IT Outsourcing Kosovo; Softwareentwicklung Kosovo |
| For Albanian-run companies | DE | Digitalagentur für albanische Unternehmen; Software für KMU auf Albanisch & Deutsch |
| Case study Spitex Schwab | EN / DE | Spitex Website; Website für Pflegedienst |
| Case study En-Nur | EN / DE | Mitgliederverwaltung Verein/Moschee; TWINT Zahlung Website Verein |
| Case study Jetonikeramika | EN / SQ | website showroom; webfaqe për biznes |

---

## 4. The plan in phases

### Phase 1: launch-ready (week 1)
**1.1**
- **You:** point mardal.co at Vercel.
- **Me:**
  - switch robots to allow (including the AI search crawlers)
  - drop the noindex for mardal.co, keeping it for previews
  - redirect mardal.vercel.app to mardal.co (308)
  - choose www or the bare domain, and redirect the other
  - check every key address returns 200 with no noindex

**1.2 Me:** remove the invented clients, the example project page and the invented About names (after 0.4).

**1.3 Me:** set `metadataBase` to https://mardal.co, give every page its own canonical, and fix the postcode (after 0.5).

**1.4 Me:** rewrite every title and description around its searches (section 3), for you to approve in one list:
- 50–60 characters for titles, 140–160 for descriptions
- a share image per page (each case study uses its own cover)

**1.5 Me:** add structured data (JSON-LD):
- Organization and WebSite on the home page
- BreadcrumbList on inner pages
- Article on case studies (about the client)
- BlogPosting on posts
- LocalBusiness for the Gjilan office, matching the Google Business Profile

All validated in Google's Rich Results Test.

**1.6 Me:** write descriptive alt text for every screenshot, e.g. "En-Nur admin dashboard with membership totals", for you to approve. Give the sitemap the real date each page last changed.

**1.7 Me:** speed:
- the slow headings show at first paint (the animation starts from visible text)
- the hero image loads first
- lighter images on the Clients page
- real-visitor measurement with Vercel Speed Insights (no cookies)

**1.8 You:**
- create the Search Console Domain property (verified by a DNS record) and Bing Webmaster Tools (imported from Search Console).
- **Me:** submit the sitemap, request indexing of the key pages, and set up IndexNow on every deploy.

**1.9 You:** apply for the Google Business Profile for the Gjilan office:
- the registered name, postcode 60000, a real address with signage
- verification is likely by video
- categories such as website designer and software company

### Phase 2: trust and depth, in English (weeks 2–6)
**2.1 Me:** split /services into 6–7 service pages, keeping /services as their overview page (keyword map above). Each page has:
- who it is for and the problems it solves
- deliverables, process, timeline and tech stack
- the pricing model (after 0.7)
- linked case studies, real FAQs and a contact call to action

I build these from your existing service texts, and you approve the additions.

**2.2 Me:** add the legal notice and the trust page (data protection, hosting, data-processing agreement, reply time). Add a company-facts block and the real team to About (after 0.5–0.6).

**2.3 Case studies:**
- **You:** send dated results and a client quote for each.
- **Me:** add a "Result" section, links to the services used, and links between case studies.

**2.4 Me:** link services, case studies and posts to each other, with descriptive link text.

**2.5 Me:** build the nearshoring page in English, citing only official sources: the Swiss foreign ministry (EDA), the STIKK IT Barometer and the ministry/GIZ ICT study.

**2.6 You and me:** one post a month drawn from a real project (you give the facts, I draft, you approve).

### Phase 3: German (weeks 4–10)
**3.1 Me:** add language routing: `/de/`, then `/sq/`.
- hreflang between the versions (en, de, sq, x-default = English)
- each version's canonical points to itself
- a language switcher
- no automatic redirects by country or browser
- translated addresses (`/de/leistungen/webdesign`)

**3.2 Me:** draft the German pages; **you** (or a native speaker) approve them:
- home
- the service pages
- Nearshoring Kosovo
- the case studies (Spitex, En-Nur, Jetonikeramika)
- contact ("Offerte anfragen")
- legal notice and privacy

**3.3 You and me:** add real case studies from your portfolio, with each client's consent. These include Swiss clients (Doratec AG, HBS Swiss AG, Bären Baugruppe AG, Stolzbau GmbH) and others such as Cityhotel and MONUN. Each one also ranks for its own niche (construction, hotel and so on).

**3.4 Me:** the German page for Albanian-run SMEs in CH and DE, offering software, apps and AI (the gap nobody fills). Only one such page, with real content, never city copies.

**3.5 Me:** German AI-automation content (n8n, chatbots, WhatsApp) built from real use cases.

### Phase 4: Albanian (weeks 8–12)
**4.1 Me:** draft the Albanian pages; **you** approve:
- home
- the service pages ("Web faqe profesionale", "Softuer & aplikacione", "Dyqan online", "Branding & dizajn")
- Jetonikeramika
- contact in Gjilan

Titles use the words people actually type ("web faqe", "webfaqe"), not only the official "uebfaqe".

### Phase 5: authority (from week 2, ongoing)
**5.1 You:** ask every client for a Google review and a Clutch review. Ask client sites for a credit or a mention, with their consent: a link in the page text, or a nofollow brand link in the footer.

**5.2 You:** create free profiles on Clutch (which feeds The Manifest), GoodFirms, DesignRush and TechBehemoths. Their links pass no SEO value; they bring referrals, reviews and AI citations.
- **Sortlist** (pay per lead) and **agenturfinder** (commission) are optional trials.
- **Me:** add each profile to the Organization data and keep the wording identical everywhere.

**5.3 You:** memberships and directories:
- STIKK BASIC (€150 a year, a member profile with a link)
- the German-Kosovar business association directory (OEGJK/KDWV)
- the Swiss-Kosovo Chamber
- later: swissalbs (CH) and UNION (DE)

**5.4 You:** events: the German-Kosovar Economic Forum (register by 18 Oct) and KosICT.

**5.5 You and me:** PR when there is news, such as a product launch (Ftesa, Arvena), a new client or a talk:
- Albinfo (CH/AT, in German and Albanian)
- Telegrafi (Gjilan, business)
- Prishtina Insight
- ICK, for the products

**5.6 You:** LinkedIn company page and team profiles. Link your portfolio's case studies (kushtrimarifi.com) to the matching Mardal pages.

---

## 5. Measuring it

**Monthly report (Me), from Search Console with its country filter for CH / DE / XK and Bing:**
- indexed pages
- impressions, clicks and positions per market
- Bing's AI Performance report
- positions for about 30 target searches from the keyword map
- Business Profile views and actions
- enquiries by source (contact page, email)
- reviews collected
- a check of what ChatGPT, Perplexity and Google AI say about "web agency Kosovo", "Nearshoring Kosovo Softwareentwicklung" and "Webagentur KMU Schweiz Laravel", in EN, DE and SQ

**Realistic expectations, with no guarantees:**
- **Weeks:** the brand name; the Business Profile in Gjilan.
- **Weeks to 3 months:** nearshoring and niche case-study searches.
- **3–9 months:** German service searches.
- **9–18+ months:** big terms like "Webagentur Zürich".

---

## 6. Not doing, on purpose
- City copies ("Webagentur Zürich / Basel / Bern" pages with swapped names). Google treats them as doorway spam.
- Mass AI-written pages, or invented results, clients, reviews or team members.
- Buying links, or sitewide footer links used for ranking.
- Virtual offices in Switzerland or Germany to get map listings. They are against the Business Profile rules.
- An llms.txt file. It has no proven effect; it may come later at the lowest priority.

---

## Sources

**Search share**
- StatCounter, Sep 2026: [Switzerland](https://gs.statcounter.com/search-engine-market-share/all/switzerland), [Germany](https://gs.statcounter.com/search-engine-market-share/all/germany), [Kosovo](https://gs.statcounter.com/search-engine-market-share/all/kosovo)

**Google, official documentation**
- [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies) · [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) · [AI features](https://developers.google.com/search/docs/appearance/ai-features) · [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Localized versions (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions) · [Multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization) · [Site names](https://developers.google.com/search/docs/appearance/site-names) · [Article](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) · [Google Images](https://developers.google.com/search/docs/appearance/google-images) · [Search updates](https://developers.google.com/search/updates)
- [Business Profile guidelines](https://support.google.com/business/answer/3038177) · [Local ranking](https://support.google.com/business/answer/7091)

**Speed (web.dev)**
- [Web Vitals](https://web.dev/articles/vitals) · [LCP](https://web.dev/articles/lcp) · [INP](https://web.dev/articles/inp)

**Next.js and Vercel**
- [JSON-LD](https://nextjs.org/docs/app/guides/json-ld) · [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) · [Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Duplicate vercel.app URLs](https://vercel.com/kb/guide/avoiding-duplicate-content-with-vercel-app-urls) · [The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler)

**Bing**
- [AI Performance report](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) · [IndexNow](https://www.indexnow.org/faq)

**AI search and ranking studies**
- Ahrefs: [How long it takes to rank](https://ahrefs.com/blog/how-long-does-it-take-to-rank/) · [AI search overlap](https://ahrefs.com/blog/ai-search-overlap/) · [Brand mentions and AI Overviews](https://ahrefs.com/blog/ai-overview-brand-correlation/)
- Pew: [Clicks when an AI summary appears](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/)

**Legal notice and data protection**
- [§5 DDG (German legal notice)](https://www.gesetze-im-internet.de/ddg/__5.html)
- [EU adequacy decisions](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en)
- [Swiss list of countries with adequate protection](https://www.bj.admin.ch/de/schweizerische-anerkennung-von-staaten-die-einen-angemessenen-datenschutz-gewaehrleisten)

**Kosovo, nearshoring and the diaspora**
- Swiss foreign ministry: [Switzerland–Kosovo relations](https://www.eda.admin.ch/en/bilateral-relations-switzerland-kosovo)
- STIKK: [IT Barometer 2023–24](https://stikk.org/wp-content/uploads/2025/12/Kosovo_IT_Barometer_2023-2024.pdf) · [Member directory](https://stikk.org/en/members/)
- Ministry/GIZ: [ICT Value Chain Study 2023](https://minti.rks-gov.net/wp-content/uploads/2026/05/5A51D351-ADBF-472A-AFE2-8C360BCB2EE4.pdf)
- Destatis: [Foreign population by nationality](https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Migration-Integration/Tabellen/auslaendische-bevoelkerung-staatsangehoerigkeit-jahre.html)
- Diaspora business: [swissalbs](https://www.swissalbs.ch) · [Prishtina Insight](https://prishtinainsight.com/second-generation-immigrants-kosovo-albanians-making-their-mark-in-swiss-business-landscape-mag/) · [Blick](https://www.blick.ch/wirtschaft/secondos-feiern-sich-in-zuerich-selbst-ihr-einfluss-hat-sich-veraendert-wir-albaner-sind-leistungstraeger-der-schweizer-wirtschaft-id20120989.html)
- Associations and events: [OEGJK/KDWV members](https://oegjk.org/sq/alle-mitglieder/) · [German-Kosovar Economic Forum](https://www.b2match.com/e/german-kosovar-economic-forum)
- Gjilan postcode: [visitkosovo.rks-gov.net](https://visitkosovo.rks-gov.net/page/qytetet-gjilan)
- Directory links are nofollow: [Clutch](https://help.clutch.co/en/knowledge/is-link-on-company-profile-follow-link)

**Domain and the Swiss hosting/registry**
- [.ch registration statistics](https://www.nic.ch/statistics/market/)
- [Search Console international targeting removed](https://support.google.com/webmasters/answer/12474899)

The full research reports, with every finding and source, are kept in this session's notes (Claude memory: `mardal-seo-research-2026-10`).

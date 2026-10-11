import type { PageHeroContent } from "../components/services/ServicesHero";

/**
 * **Nearshoring from Kosovo** — SEO-PLAN.md, steps 2.5 and 3; owner,
 * 2026-10-11: "English first then De and AL". Written for him, plainly, for
 * the companies in Switzerland and Germany that search for it (SEO-PLAN.md,
 * section 2: weak competition, few searches, high intent).
 *
 * **Nothing here that is not a fact on record.** About Kosovo, only what the
 * Swiss foreign ministry, the Kosovo ICT association (STIKK) and the Kosovo
 * ministry's study published, each linked and checked against the source on
 * 2026-10-11 (the barometer's "about 68% operate internationally" and "DACH
 * (52%)", the study's KAS figures); about Mardal, only what the site
 * already says — where it is, what it builds, the real projects, and the
 * owner's own line about the team. No savings, no team size, no languages
 * spoken, no data-protection promise until the owner decides one
 * (SEO-PLAN.md, 0.6).
 */

export const nearshoringPage = {
  path: "/nearshoring-kosovo",
  /** The tab, before " — Mardal", and the line for search results. */
  title: "Nearshoring from Kosovo: Software and Web Development",
  description:
    "Mardal is a digital agency in Gjilan, Kosovo, building websites, software and AI automation for companies in Switzerland and Germany, in the same time zone.",
} as const;

export const nearshoringHero = {
  label: "Nearshoring",
  titleLines: ["Nearshoring", "from Kosovo"],
  titleStop: ".",
  note: "Mardal is a digital agency in Gjilan, Kosovo. We design and build websites, software and AI automation for companies in Switzerland and Germany.",
} as const satisfies PageHeroContent;

/** Each part: a heading, its paragraphs, and the links that go with it. */
export const nearshoringParts: readonly {
  readonly id: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly links?: readonly { readonly label: string; readonly href: string }[];
}[] = [
  {
    id: "why-kosovo",
    heading: "Why Kosovo",
    paragraphs: [
      "Switzerland is the main export market for Kosovo’s IT and outsourcing services, and the Swiss Federal Department of Foreign Affairs notes that Kosovo has become a nearshoring destination for Swiss companies.",
      "In the IT Barometer 2023–2024 of STIKK, the Kosovo ICT association, about 68% of the 115 companies surveyed operate internationally, and Germany, Austria and Switzerland are their main market abroad, named by 52% of them. According to the Kosovo Agency of Statistics, the sector counts more than 1,200 companies and 11,500 jobs, as the ICT Value Chain Study of the Kosovo Ministry of Industry, Entrepreneurship and Trade and GIZ reports.",
      "Kosovo shares the time zone of Switzerland and Germany, and uses the euro.",
    ],
  },
  {
    id: "what-we-build",
    heading: "What we build",
    paragraphs: [
      "Websites and online stores, custom software, web platforms and mobile apps, CRM systems, AI assistants and automation, and the brand and design work around them.",
    ],
    links: [
      { label: "Websites & E-commerce", href: "/services/websites" },
      { label: "Custom Software & Apps", href: "/services/software" },
      { label: "CRM & Sales Automation", href: "/services/crm" },
      { label: "AI & Automation", href: "/services/ai-automation" },
      { label: "Branding & Design", href: "/services/branding-design" },
    ],
  },
  {
    id: "work",
    heading: "Work for Swiss clients",
    paragraphs: [
      "A website for Spitex Schwab AG, a home-care provider in Bern, and a membership and donations platform for En-Nur, a mosque community in Switzerland, with payments by Stripe and TWINT. In Kosovo, the website of Jetonikeramika’s tile showroom.",
    ],
    links: [
      { label: "Spitex Schwab AG — Home Care Website, Bern", href: "/case-studies/spitex-schwab" },
      { label: "En-Nur — Laravel Membership & Donations App", href: "/case-studies/en-nur" },
      { label: "Jetonikeramika — Tile Showroom Website", href: "/case-studies/jetonikeramika" },
    ],
  },
  {
    id: "team",
    heading: "Who you work with",
    paragraphs: [
      "Our core team is small on purpose, but highly skilled, so you get the right talent and expertise, all the time.",
    ],
    links: [{ label: "About Mardal", href: "/about" }],
  },
];

/** Where the facts about Kosovo come from. */
export const nearshoringSources = [
  {
    label: "Swiss Federal Department of Foreign Affairs",
    href: "https://www.eda.admin.ch/en/bilateral-relations-switzerland-kosovo",
  },
  {
    label: "STIKK — Kosovo IT Barometer 2023–2024",
    href: "https://stikk.org/wp-content/uploads/2025/12/Kosovo_IT_Barometer_2023-2024.pdf",
  },
  {
    label: "Kosovo ICT Value Chain Study (Ministry of Industry, GIZ), 2023",
    href: "https://minti.rks-gov.net/wp-content/uploads/2026/05/5A51D351-ADBF-472A-AFE2-8C360BCB2EE4.pdf",
  },
] as const;

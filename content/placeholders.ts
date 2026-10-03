/**
 * The pages that exist as an address before they exist as writing.
 *
 * Every word in the header and the footer now goes to a page. Twelve of those
 * pages have not been written yet, and until today each of them was an anchor:
 * `#privacy` and `#careers` pointed at nothing at all, and `#products`,
 * `#company` and the three product anchors only scrolled the homepage — from
 * any other page they did not resolve either.
 *
 * The answer is not to delete the words. It is to give each one a page that
 * says, in the site's own voice, that it is being written. So they share a
 * heading — the two lines below, set once — and differ by the three things a
 * reader actually needs: which page this is, what it will hold, and where the
 * nearest real thing is today.
 *
 * They shared a fourth for a day: the redaction bars, each page drawing its own
 * part of them. Owner took the artwork out at Products and Company, so it is
 * out on all of them — it was one picture on one component, and half of them
 * keeping it would have been a set of pages that no longer agree.
 *
 * Copy only. The page itself is `components/placeholder/PlaceholderPage.tsx`,
 * and the route files under `app/` are four lines each, so replacing one of
 * these with the real page means deleting an entry here and writing that route
 * — nothing else on the site has to be touched.
 *
 * Careers went that way first, 2026-08-19: it left this module for
 * `content/careers.ts` and `app/careers/page.tsx`, and the count below went
 * from twelve to eleven. UX/UI & Branding brought it back to twelve on
 * 2026-08-24 — a service named in the menu with no copy written for it yet —
 * and went the other way on 2026-08-25, when the owner asked for it written.
 * About was the third, on 2026-08-26, and took the count to ten; Contact was
 * the fourth, on 2026-09-13, and takes it to nine. All four left the same way,
 * by deleting an entry here and writing a route.
 * `PlaceholderKey` is derived from these keys, so removing one makes the
 * compiler find every reference to it.
 */

import { contactEmail } from "./home";

/**
 * The heading every one of them carries, hand-broken the way both headers on
 * this site are: explicit line spans, so the break falls in the same place at
 * every width rather than wherever the column runs out.
 */
export const placeholderTitleLines = ["Working", "on it."] as const;

export type Placeholder = {
  /** The small line above the heading — which page this is. Without it ten
   *  pages would be indistinguishable from one another. */
  readonly label: string;
  /** `<title>`, which the root layout completes as "%s — Mardal". */
  readonly title: string;
  readonly description: string;
  /** The hero's display line: what the page will hold, in one sentence. It is
   *  set at 30–40px in a 16ch column, so it has to be short. */
  readonly support: string;
  /** The way out, and the point of the page: the nearest real thing today. */
  readonly cta: string;
  readonly ctaHref: string;
  /**
   * The hero's drawing, as the modifier on `.service-hero__pattern`.
   *
   * **Optional, and almost always absent.** The owner took the artwork off
   * these heroes on 2026-08-19 — "at products, at company we dont need that
   * pattern design" — and a test holds it off all of them, because a missing
   * picture reads as an omission and the reflex is to put it back.
   *
   * What changed on 2026-08-24 is that one of these is a SERVICE. UX/UI &
   * Branding stands in a list of five beside four written service pages that
   * each carry a drawing, and a bare hero there does not read as restraint, it
   * reads as the one that is not finished. An index or a legal page has no such
   * siblings, so those stay bare and this field stays undefined on them.
   */
  readonly pattern?: string;
};

const getInTouch = {
  cta: "Get in touch",
  ctaHref: `mailto:${contactEmail}`,
} as const;

/**
 * Keyed by route, and the keys are read by the test that walks all nine.
 * `/products/arvena-ai` is written `products/arvena-ai` — the leading slash is
 * added where it is needed rather than stored ten times.
 */
export const placeholders = {
  products: {
    label: "Products",
    title: "Products",
    description: "The products Mardal is building.",
    support: "The products we are building for ourselves.",
    cta: "See the products",
    ctaHref: "/#products",
  },
  "products/arvena-ai": {
    label: "Arvena AI",
    title: "Arvena AI",
    description: "Applied AI for mental-health support.",
    support: "Applied AI for mental-health support.",
    cta: "See the products",
    ctaHref: "/#products",
  },
  "products/ftesa": {
    label: "Ftesa.co",
    title: "Ftesa.co",
    description: "Digital invitations, personal to every guest.",
    support: "Digital invitations, personal to every guest.",
    cta: "See the products",
    ctaHref: "/#products",
  },
  "products/ihrauto": {
    label: "Ihrauto",
    title: "Ihrauto",
    description: "Workshop operations, from booking to invoice.",
    support: "Workshop operations, from booking to invoice.",
    cta: "See the products",
    ctaHref: "/#products",
  },
  services: {
    label: "Services",
    title: "Services",
    description: "The seven services Mardal offers, in one place.",
    support: "The seven ways we work, gathered in one place.",
    /* Five of the seven service pages are written — the most finished part of
       this site — so the way out of the index that has not been written is
       into them. Seven since 2026-10-03, when the menu split into Development
       and Creative and UX/UI Design and Print Design joined it, both below. */
    cta: "See a service page",
    ctaHref: "/services/ai-automation",
  },
  /* The two services added with the Development / Creative split, 2026-10-03.
     Both are Creative, so the way out is the Creative page that is written. */
  "services/ux-ui-design": {
    label: "UX/UI Design",
    title: "UX/UI Design",
    description: "UX/UI design by Mardal.",
    support: "Interfaces for websites, software and apps.",
    cta: "See Branding & Logo",
    ctaHref: "/services/branding",
  },
  "services/print-design": {
    label: "Print Design",
    title: "Print Design",
    description: "Print design by Mardal.",
    support: "Design made for print.",
    cta: "See Branding & Logo",
    ctaHref: "/services/branding",
  },
  company: {
    label: "Company",
    title: "Company",
    description: "Who Mardal is and how it works.",
    support: "Who we are and how we work.",
    cta: "Why Mardal",
    ctaHref: "/#company",
  },
  privacy: {
    label: "Privacy",
    title: "Privacy",
    description: "How Mardal handles personal data.",
    support: "How personal data is handled here.",
    ...getInTouch,
  },
  terms: {
    label: "Terms",
    title: "Terms",
    description: "The terms this site is used under.",
    support: "The terms this site is used under.",
    ...getInTouch,
  },
  cookies: {
    label: "Cookies",
    title: "Cookies",
    description: "What this site stores, and why.",
    support: "What this site stores, and why.",
    ...getInTouch,
  },
} as const satisfies Record<string, Placeholder>;

export type PlaceholderKey = keyof typeof placeholders;

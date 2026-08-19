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
 * out on all twelve — it was one picture on one component, and half of them
 * keeping it would have been twelve pages that no longer agree.
 *
 * Copy only. The page itself is `components/placeholder/PlaceholderPage.tsx`,
 * and the route files under `app/` are four lines each, so replacing one of
 * these with the real page means deleting an entry here and writing that route
 * — nothing else on the site has to be touched.
 */

import { contactEmail } from "./home";

/**
 * The heading every one of them carries, hand-broken the way both headers on
 * this site are: explicit line spans, so the break falls in the same place at
 * every width rather than wherever the column runs out.
 */
export const placeholderTitleLines = ["Working", "on it."] as const;

export type Placeholder = {
  /** The small line above the heading — which page this is. Without it twelve
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
};

const getInTouch = {
  cta: "Get in touch",
  ctaHref: `mailto:${contactEmail}`,
} as const;

/**
 * Keyed by route, and the keys are read by the test that walks all twelve.
 * `/products/arvena-ai` is written `products/arvena-ai` — the leading slash is
 * added where it is needed rather than stored twelve times.
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
    description: "The five services Mardal offers, in one place.",
    support: "The five ways we work, gathered in one place.",
    /* The five service pages are the one part of this site that is finished,
       so the way out of the index that has not been written is into them. */
    cta: "See a service page",
    ctaHref: "/services/ai-automation",
  },
  company: {
    label: "Company",
    title: "Company",
    description: "Who Mardal is and how it works.",
    support: "Who we are and how we work.",
    cta: "Why Mardal",
    ctaHref: "/#company",
  },
  about: {
    label: "About",
    title: "About",
    description: "The people and the thinking behind the work.",
    support: "The people and the thinking behind the work.",
    cta: "Why Mardal",
    ctaHref: "/#company",
  },
  careers: {
    label: "Careers",
    title: "Careers",
    description: "Roles at Mardal.",
    /* No count, no dates and no departments. PRODUCT.md records a core of
       roughly two to five and nothing about hiring, and a page that invents a
       number is worse than a page with a gap. */
    support: "Roles will be posted here as they open.",
    ...getInTouch,
  },
  contact: {
    label: "Contact",
    title: "Contact",
    description: "How to reach Mardal.",
    /* True on every page of the site: the footer carries the email, the phone
       and the address, and it is under this page too. */
    support: "Email, phone and address are in the footer.",
    ...getInTouch,
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

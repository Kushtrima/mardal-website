import { contactEmail, footer, siteUrl } from "../content/home";
import { servicesIndex } from "../content/services-index";
import type { Story } from "../content/case-studies";

/**
 * **What search engines and AI answers read about Mardal** — SEO-PLAN.md,
 * step 1.5. Structured data (schema.org JSON-LD) built only from what the
 * pages already say: no fact appears here that a visitor cannot see.
 *
 * Absolute addresses on mardal.co, the canonical home of everything here,
 * even while the site is a preview — which no crawler is let into.
 *
 * The founding year (2026) and the postcode (60000, the footer's "6000"
 * corrected) are the owner's, 2026-10-11. Left out until he has them: the
 * registered legal name and number, and the team.
 */

const ORG_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

/** The one sentence that says what Mardal is, the same everywhere it is
 *  written (SEO-PLAN.md, section 3). */
export const companyDescription =
  "Digital agency for Switzerland, Germany and Kosovo: websites, custom software and AI automation.";

const MARKETS = ["Switzerland", "Germany", "Kosovo"].map((name) => ({
  "@type": "Country",
  name,
}));

const absolute = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);

/** Mardal, as every other node refers to it. */
const organizationRef = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Mardal",
  url: `${siteUrl}/`,
};

/** The company: the homepage's, in full. */
export function organization() {
  return {
    ...organizationRef,
    logo: `${siteUrl}/mardal-mark.svg`,
    description: companyDescription,
    email: contactEmail,
    foundingDate: "2026",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rr. “Isa Boletini”",
      postalCode: "60000",
      addressLocality: "Gjilan",
      addressCountry: "XK",
    },
    areaServed: MARKETS,
    sameAs: footer.social.map((account) => account.href),
  };
}

/** The site itself, so its name shows as "Mardal" — a name it shares with a
 *  Norwegian village, a waterfall and a footballer. */
export function website() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Mardal",
    alternateName: ["mardal.co"],
    url: `${siteUrl}/`,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

/** Where a page sits: Home, then each step down to it. */
export function breadcrumbs(trail: readonly { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: absolute(step.path),
    })),
  };
}

/** The services page: every service on it, by name, from Mardal. */
export function servicesList() {
  return {
    "@type": "ItemList",
    name: "Services",
    itemListElement: servicesIndex.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.label,
        serviceType: service.group,
        ...(service.summary ? { description: service.summary } : {}),
        provider: organizationRef,
        areaServed: MARKETS,
      },
    })),
  };
}

/** A service page: each of its services, by name and in the owner's words,
 *  from Mardal, at its place on the page. */
export function serviceHubServices(
  slug: string,
  services: readonly { label: string; summary?: string }[],
  anchor: (label: string) => string,
) {
  return services.map((service) => ({
    "@type": "Service",
    name: service.label,
    ...(service.summary ? { description: service.summary } : {}),
    url: absolute(`/services/${slug}#${anchor(service.label)}`),
    provider: organizationRef,
    areaServed: MARKETS,
  }));
}

/** A case study: an article by Mardal about one real client. Only for a
 *  story whose client is real and live — the sample's would describe a
 *  company that does not exist. */
export function caseStudyArticle(story: Story) {
  if (!story.live.href) return null;
  const url = absolute(`/case-studies/${story.slug}`);
  return {
    "@type": "Article",
    headline: story.title,
    description: story.lede,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    image: [story.ogImage, story.heroImage].filter(Boolean).map((image) => absolute(image!)),
    author: organizationRef,
    publisher: organizationRef,
    about: { "@type": "Organization", name: story.name, url: story.live.href },
  };
}

/** Where an author is to be found: a real person's own page, so the writing
 *  is tied to someone who can be looked up (SEO-PLAN.md, Google's trust
 *  guidance). */
const AUTHOR_PAGES: Readonly<Record<string, string>> = {
  "Kushtrim Arifi": "https://kushtrimarifi.com/",
};

/** A piece of writing: its headline, its author and its date. */
export function blogPosting(post: {
  slug: string;
  title: string;
  thesis: string;
  date: string;
  author: string;
}) {
  const url = absolute(`/blog/${post.slug}`);
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.thesis,
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      ...(AUTHOR_PAGES[post.author] ? { url: AUTHOR_PAGES[post.author] } : {}),
    },
    publisher: organizationRef,
  };
}

/** A page that is about Mardal, or for reaching it. */
export function pageAbout(type: "AboutPage" | "ContactPage", path: string, name: string) {
  return {
    "@type": type,
    name,
    url: absolute(path),
    mainEntity: organizationRef,
  };
}

/** One page's nodes, as one JSON-LD document. */
export function graph(...nodes: readonly (object | readonly object[] | null)[]) {
  return { "@context": "https://schema.org", "@graph": nodes.flat().filter(Boolean) };
}

import type { PageHeroContent } from "../components/services/ServicesHero";
import { servicesIndex, type ServiceIndexEntry } from "./services-index";

/**
 * **A page for each kind of work people search for** — SEO-PLAN.md, step
 * 2.1; owner, 2026-10-11, asked whether the services' own pages may come
 * back (he deleted the old ones on 2026-10-08): "make it what is best".
 *
 * Five pages, not nineteen: each holds the services people look for
 * together, so every page says enough to be worth finding — a website and
 * an online store, software and an app, a CRM and the automation that keeps
 * it current. Every service's paragraph and list on them is the owner's own,
 * from content/services-index.ts, word for word; written here are only each
 * page's opening line, its title and line for search results, and which
 * real projects it points to.
 *
 * /services keeps every service on its wheel, and each one links here.
 */

export type ServiceHub = {
  readonly slug: string;
  /** In the menu and in links. */
  readonly name: string;
  /** The tab, before " — Mardal". */
  readonly title: string;
  /** The line for search results. */
  readonly description: string;
  readonly hero: PageHeroContent;
  /** The services on it, by their names in content/services-index.ts. */
  readonly services: readonly string[];
  /** The real projects that show it, by their slugs. */
  readonly related: readonly string[];
};

export const serviceHubs: readonly ServiceHub[] = [
  {
    slug: "websites",
    name: "Websites & E-commerce",
    title: "Websites & E-commerce: Web Design and Development",
    description:
      "Websites, web design and online stores from Mardal: responsive, fast and easy to manage, built around your business goals in Switzerland, Germany and Kosovo.",
    hero: {
      label: "Service",
      titleLines: ["Websites and", "e-commerce"],
      titleStop: ".",
      note: "Websites, web design and online stores, designed and built around the goals your business needs to achieve.",
    },
    services: ["Websites", "Web Design", "E-commerce"],
    related: ["spitex-schwab", "jetonikeramika"],
  },
  {
    slug: "software",
    name: "Custom Software & Apps",
    title: "Custom Software, Web Platforms & Mobile Apps",
    description:
      "Custom software, web platforms, mobile apps and integrations from Mardal, built around the way your business actually operates instead of generic tools.",
    hero: {
      label: "Service",
      titleLines: ["Custom software,", "web platforms and mobile apps"],
      titleStop: ".",
      note: "Software built around the way your business actually operates: web platforms, mobile apps, custom software and the integrations between them.",
    },
    services: ["Custom Software", "Web Platforms", "Mobile Apps", "API & Integrations"],
    related: ["en-nur"],
  },
  {
    slug: "crm",
    name: "CRM & Sales Automation",
    title: "CRM Solutions & Sales Automation",
    description:
      "CRM selection, implementation and customization, and sales automation that keeps your CRM up to date: customer information, sales and reporting in one place.",
    hero: {
      label: "Service",
      titleLines: ["CRM solutions and", "sales automation"],
      titleStop: ".",
      note: "Customer information, sales, activities, service and reporting in one structured environment, with the repetitive work automated.",
    },
    services: ["CRM Solutions", "Sales & CRM Automation"],
    related: ["en-nur"],
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    title: "AI Assistants, AI Integrations & Workflow Automation",
    description:
      "AI assistants, AI integrations, workflow and customer service automation from Mardal, connected to the tools and systems your business already uses.",
    hero: {
      label: "Service",
      titleLines: ["AI assistants", "and automation"],
      titleStop: ".",
      note: "AI assistants and automation connected to the tools and systems your business already uses.",
    },
    services: [
      "AI Assistants",
      "AI Integrations",
      "Workflow Automation",
      "Customer Service Automation",
    ],
    related: [],
  },
  {
    slug: "branding-design",
    name: "Branding & Design",
    title: "Branding, Visual Identity & UX/UI Design",
    description:
      "Brand strategy, visual identity, UX/UI, web and product design, print and social media design from Mardal, consistent across every touchpoint.",
    hero: {
      label: "Service",
      titleLines: ["Branding and", "UX/UI design"],
      titleStop: ".",
      note: "Brand strategy, visual identity and design for every touchpoint, from your logo to websites, apps, print and social media.",
    },
    services: [
      "Branding",
      "Visual Identity",
      "UX/UI Design",
      "Product Design",
      "Print Design",
      "Social Media Design",
    ],
    related: ["jetonikeramika", "spitex-schwab", "en-nur"],
  },
];

/** A service's place on its page: "UX/UI Design" → "ux-ui-design". */
export const serviceAnchor = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The page a service is on, and the address of its place there. */
export function serviceHref(label: string): string {
  const hub = serviceHubs.find((entry) => entry.services.includes(label));
  return hub ? `/services/${hub.slug}#${serviceAnchor(label)}` : "/services";
}

/** A page's services, with the owner's words for each. */
export function hubServices(hub: ServiceHub): readonly ServiceIndexEntry[] {
  return hub.services.map((label) => {
    const entry = servicesIndex.find((service) => service.label === label);
    if (!entry) throw new Error(`No service "${label}" in content/services-index.ts`);
    return entry;
  });
}

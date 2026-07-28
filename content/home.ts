/**
 * Single source of truth for every word on the homepage.
 *
 * Components import from here instead of holding their own copy, so text and
 * the contact address are edited in one place. Keep this file free of JSX and
 * components: it is data only.
 */

export const contactEmail = "hello@mardal.com";

export const whyMardal = {
  label: "Why Mardal?",
  titleLines: ["Build smarter.", "Scale faster."],
  copy:
    "We help your business work better by building and connecting the technology you use every day, from AI and automation to CRM, custom software and web platforms. Everything is shaped around your team, your processes and the way your business actually works.",
  cards: [
    {
      position: "one",
      art: "columns",
      label: "Applied AI",
      title: "Solving real business problems with AI",
      copy: "We use AI where it can make work faster, decisions clearer, and services more useful.",
    },
    {
      position: "two",
      art: "cycle",
      label: "Automation",
      title: "Less repetition. More progress.",
      copy: "We automate routine work so your team can focus on customers, decisions, and growth.",
    },
    {
      position: "three",
      art: "handoff",
      label: "Connected Systems",
      title: "Everything working together",
      copy: "We connect your CRM, software, data, and platforms so information moves without unnecessary manual work.",
    },
    {
      position: "four",
      art: "orbit",
      label: "Technology Partnership",
      title: "Built with you. Improved as you grow.",
      copy: "We stay involved beyond launch, adapting and improving your technology as your business changes.",
    },
  ],
} as const;

export const services = {
  id: "services",
  eyebrow: "What we do",
  title: "Services built around the way you work.",
  summary:
    "From applied AI to connected platforms, we remove friction, speed up delivery, and give teams room to grow.",
  items: [
    {
      id: "ai-automation",
      title: "AI & Automation",
      description:
        "Turn repetitive work into intelligent, dependable workflows.",
    },
    {
      id: "system-integration",
      title: "System Integration",
      description: "Make your tools, data, and teams work together as one.",
    },
    {
      id: "crm-solutions",
      title: "CRM Solutions",
      description: "Give customer-facing teams one clear place to work.",
    },
    {
      id: "custom-software",
      title: "Custom Software",
      description: "Build the software your business actually needs.",
    },
    {
      id: "web-platforms",
      title: "Web Platforms",
      description: "Fast, scalable digital experiences that are easy to use.",
    },
  ],
} as const;

/**
 * The six coloured boxes: the five services the menu names, and the way of
 * working the site claims alongside them.
 *
 * Each carries the id its menu entry links to, so the Services menu lands on
 * the box for that service instead of nowhere.
 */
export const difference = {
  id: "difference",
  titleLines: ["What Makes Us", "Different."],
  /** Two columns under the heading, set against the second and third box. */
  intro: [
    "Five connected services. One team. Our designers, engineers and AI specialists work together across automation, CRM, custom software, web platforms and system integration, from strategy to delivery.",
    "Instead of managing separate teams and disconnected tools, you get one partner that makes everything work together—helping your business move faster, adapt more easily and grow with less complexity.",
  ],
  items: [
    { id: "ai-automation", lines: ["AI &", "Automation"] },
    { id: "system-integration", lines: ["System", "Integration"] },
    { id: "crm-solutions", lines: ["CRM", "Solutions"] },
    { id: "custom-software", lines: ["Custom", "Software"] },
    { id: "web-platforms", lines: ["Web", "Platforms"] },
  ],
} as const;

export const solutions = {
  id: "solutions",
  eyebrow: "Who we build for",
  title: "Technology shaped around the realities of your sector.",
  lede: "Built across industries",
  items: [
    {
      id: "finance",
      title: "Finance",
      descriptor:
        "Banks, insurance companies, fintech platforms and financial service providers.",
    },
    {
      id: "healthcare",
      title: "Healthcare",
      descriptor:
        "Hospitals, clinics, pharmacies and organizations delivering health services.",
    },
    {
      id: "manufacturing",
      title: "Manufacturing",
      descriptor:
        "Factories, production companies and businesses managing industrial operations.",
    },
    {
      id: "automotive",
      title: "Automotive",
      descriptor:
        "Dealerships, repair services, vehicle platforms and mobility companies.",
    },
    {
      id: "retail",
      title: "Retail",
      descriptor:
        "Physical stores, e-commerce businesses and consumer-focused brands.",
    },
    {
      id: "logistics",
      title: "Logistics",
      descriptor:
        "Transport companies, warehouses, distributors and delivery service providers.",
    },
    {
      id: "public-sector",
      title: "Public Sector",
      descriptor:
        "Government institutions, municipalities and organizations providing public services.",
    },
  ],
} as const;

export const products = {
  id: "products",
  eyebrow: "Mardal Products",
  title: "Products are how we test our thinking.",
  summary:
    "We turn focused ideas into useful digital experiences, then carry what we learn into every client partnership.",
  /** Photographs, not screenshots: none of the three has an interface worth
   *  showing yet, so each image stands for what the product is about rather
   *  than claiming to be the product. */
  items: [
    {
      id: "arvena-ai",
      title: "Arvena AI",
      status: "In development",
      description:
        "Applied AI for mental-health support, built around safety and consent.",
      image:
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A footbridge running into woodland.",
      field: "Mental health",
    },
    {
      id: "ihrauto",
      title: "Ihrauto",
      status: "In development",
      description: "Workshop operations, from first call to final invoice.",
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A workshop wall hung with tools.",
      field: "Automotive",
    },
    {
      id: "ftesa",
      title: "Ftesa.co",
      status: "In development",
      description:
        "Self-service digital invitations, personalised for every guest.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A long table laid for guests.",
      field: "Events",
    },
  ],
  /** The two things that are actually known about each. There is no launch
   *  date, no version and no user count to put here, and inventing one would
   *  be worse than the gap. */
  factLabels: { status: "Status", field: "Field" },
  cta: "Get in touch",
  ctaHref: "mailto:hello@mardal.com",
} as const;

export const contact = {
  id: "contact",
  eyebrow: "Have something in mind?",
  /** Rendered one masked line at a time, like the hero headline. */
  titleLines: ["Let’s build what", "moves you forward."],
  body:
    "Tell us where you are, what’s getting in the way, and what better could look like.",
  cta: "Start a conversation",
} as const;

export const footer = {
  statement: "Technology that works for people and moves business forward.",
  /** Only anchors that exist on the page. */
  company: [
    { label: "Case study", href: "#case-studies" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

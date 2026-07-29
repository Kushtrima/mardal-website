/**
 * Single source of truth for every word on the homepage.
 *
 * Components import from here instead of holding their own copy, so text and
 * the contact address are edited in one place. Keep this file free of JSX and
 * components: it is data only.
 */

/**
 * The site's menu, and the only copy of it.
 *
 * The header renders it as the mega menu and the footer renders it as its link
 * columns, so the two cannot say different things — which they did while this
 * lived inside the header component.
 */
export const menu = [
  {
    key: "services",
    label: "Services",
    eyebrow: "Mardal Services",
    description: "Build, connect, and automate the systems behind your growth.",
    href: "#services",
    items: [
      { label: "AI & Automation", href: "#ai-automation" },
      { label: "System Integration", href: "#system-integration" },
      { label: "CRM Solutions", href: "#crm-solutions" },
      { label: "Custom Software", href: "#custom-software" },
      { label: "Web Platforms", href: "#web-platforms" },
    ],
  },
  {
    key: "solutions",
    label: "Solutions",
    eyebrow: "Solutions by Industry",
    description: "Technology shaped around the realities of your sector.",
    href: "#solutions",
    items: [
      { label: "Finance", href: "#finance" },
      { label: "Healthcare", href: "#healthcare" },
      { label: "Manufacturing", href: "#manufacturing" },
      { label: "Automotive", href: "#automotive" },
      { label: "Retail", href: "#retail" },
      { label: "Logistics", href: "#logistics" },
      { label: "Public Sector", href: "#public-sector" },
    ],
  },
  {
    key: "products",
    label: "Products",
    eyebrow: "Mardal Products",
    description: "Focused digital products designed and built by Mardal.",
    href: "#products",
    items: [
      { label: "Arvena AI", href: "#arvena-ai" },
      { label: "Ftesa.co", href: "#ftesa" },
      { label: "Ihrauto", href: "#ihrauto" },
    ],
  },
  {
    key: "case-studies",
    label: "Case Studies",
    eyebrow: "Mardal Projects",
    description: "See how our ideas become useful, working products.",
    href: "#case-studies",
    items: [{ label: "ArvenaAI", href: "#arvena-ai-case-study" }],
  },
  {
    key: "company",
    label: "Company",
    eyebrow: "Inside Mardal",
    description: "Meet the people, thinking, and culture behind our work.",
    href: "#company",
    items: [
      { label: "About", href: "#about" },
      { label: "Team", href: "#team" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
] as const;

export const contactEmail = "info@mardal.co";

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
  /** Set as explicit lines, so the break falls in the same place at every
   *  width and the step below it is a decision rather than a wrap. */
  titleLines: ["Products are", "how we test", "our thinking."],
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
        "Applied AI for mental-health support, built around safety and consent. The hard part was never the conversation — it is knowing what not to say, when to step back, and how to hand someone on to real help.",
      image:
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A footbridge running into woodland.",
      field: "Mental health",
      year: "[Year]",
    },
    {
      id: "ihrauto",
      title: "Ihrauto",
      status: "In development",
      description:
        "Workshop operations, from first call to final invoice. One record follows the car through booking, parts, labour and payment, so the same details are not typed again at every stage.",
      image:
        "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A workshop wall hung with tools.",
      field: "Automotive",
      year: "[Year]",
    },
    {
      id: "ftesa",
      title: "Ftesa.co",
      status: "In development",
      description:
        "Self-service digital invitations, personalised for every guest. Everyone invited gets their own invitation and their own link, and the replies come back to one place instead of scattered across a dozen chats.",
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=70",
      imageAlt: "A long table laid for guests.",
      field: "Events",
      year: "[Year]",
    },
  ],
  /** Status and Field are known. Year is not: nobody has said when each of
   *  these started or is due, so it ships as a bracket to be filled rather
   *  than as a plausible-looking number. */
  factLabels: { status: "Status", field: "Field", year: "Year" },
  cta: "Get in touch",
  ctaHref: "mailto:info@mardal.co",
} as const;

export const contact = {
  id: "contact",
  eyebrow: "Have something in mind?",
  /** Set as explicit lines, so the break falls in the same place at every
   *  width rather than wherever the column happens to run out. */
  titleLines: ["Let’s build", "smarter"],
  body:
    "Tell us what you want to improve, automate, or create. We’ll help turn it into a practical digital solution.",
  cta: "Start a conversation",
} as const;

export const footer = {
  statement: "Technology that works for people and moves business forward.",
  /**
   * Where and how to reach Mardal — all of it real, supplied by the owner.
   *
   * The phone is written with the spaces it is read with and dialled without
   * them; the address keeps its typographic quotes rather than the typewriter
   * pair, the way every other apostrophe on the page is set.
   */
  details: [
    { label: "Email", value: contactEmail, href: `mailto:${contactEmail}` },
    { label: "Phone", value: "+383 49 210 999", href: "tel:+38349210999" },
    /* Hard spaces inside the street name. The value column is 134px wide on a
       320 screen and the address is thirty characters, so it wraps — and left
       to itself it wrapped straight after the opening quote, `“Isa` on one
       line and `Boletini”` on the next, which reads as a fault rather than as
       a long address. It can break after the city or before the number; it
       cannot break inside the name. */
    {
      label: "Address",
      value: "Gjilan, Rr. “Isa Boletini” 6000",
      href: "",
    },
  ],
  /**
   * Drawn rather than named, and not yet links: the accounts exist but their
   * addresses have not been given, and a guessed profile URL is worse than a
   * mark that waits for one.
   */
  socialLabel: "Follow",
  social: ["instagram", "facebook", "linkedin"],
  /**
   * The three a company site is expected to carry. None of them exists yet —
   * they are written here as the anchors they will be, so the footer is not
   * holding invented URLs.
   */
  legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookies", href: "#cookies" },
  ],
} as const;

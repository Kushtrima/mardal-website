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

export const solutions = {
  id: "solutions",
  eyebrow: "Who we build for",
  title: "Technology shaped around the realities of your sector.",
  lede: "Our experience across different industries shapes how we approach every project.",
  items: [
    {
      id: "financial-services",
      title: "Financial Services",
      descriptor: "Compliance-aware systems",
    },
    {
      id: "healthcare",
      title: "Healthcare",
      descriptor: "Care that stays private",
    },
    {
      id: "manufacturing",
      title: "Manufacturing",
      descriptor: "Visibility on the floor",
    },
    {
      id: "automotive",
      title: "Automotive",
      descriptor: "Workshops that run on time",
    },
    {
      id: "public-sector",
      title: "Public Sector",
      descriptor: "Services people can use",
    },
  ],
} as const;

export const products = {
  id: "products",
  eyebrow: "Mardal Products",
  title: "Products are how we test our thinking.",
  summary:
    "We turn focused ideas into useful digital experiences, then carry what we learn into every client partnership.",
  items: [
    {
      id: "arvena-ai",
      title: "Arvena AI",
      status: "In development",
      description:
        "Applied AI for mental-health support, built around safety and consent.",
    },
    {
      id: "ftesa",
      title: "Ftesa.co",
      status: "In development",
      description:
        "Self-service digital invitations, personalised for every guest.",
    },
    {
      id: "ihrauto",
      title: "Ihrauto",
      status: "In development",
      description: "Workshop operations, from first call to final invoice.",
    },
  ],
} as const;

export const caseStudy = {
  id: "case-studies",
  anchor: "arvena-ai-case-study",
  eyebrow: "Mardal Projects",
  title: "Intelligence, shaped into a product.",
  body:
    "Arvena AI brings Mardal’s product thinking, interface design, and applied intelligence into one focused digital experience.",
  chip: "Case study in progress",
} as const;

export const workProcess = {
  id: "process",
  eyebrow: "How we work",
  title: "A simple path from idea to working software.",
  summary:
    "No unnecessary complexity. Just clear decisions, close collaboration, and useful progress.",
  steps: [
    {
      title: "Understand",
      description:
        "We learn how your team works, where friction lives, and what needs to change.",
    },
    {
      title: "Shape",
      description:
        "We turn the problem into a clear product direction, prototype, and practical plan.",
    },
    {
      title: "Build",
      description:
        "We deliver in focused stages, test what matters, and improve it with you.",
    },
  ],
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

/**
 * The AI & Automation service page.
 *
 * Every line here is one the site already says somewhere — the menu's own
 * description of the service, and the two cards on the homepage that cover
 * applied AI and automation. Nothing new has been claimed on Mardal's behalf:
 * a service page is exactly where invented capability would do the most
 * damage, so what is here is what has already been approved, set out at the
 * length a page of its own allows.
 */
export const aiAutomation = {
  slug: "ai-automation",
  eyebrow: "Mardal Services",
  title: "AI & Automation",
  lede: "Turn repetitive work into intelligent workflows.",
  support: "Build smarter operations with AI agents.",
  heroCta: "Let’s build",
  /** The two homepage cards that belong to this service, at length. */
  blocks: [
    {
      id: "applied-ai",
      label: "Applied AI",
      title: "Solving real business problems with AI",
      copy: "We use AI where it can make work faster, decisions clearer, and services more useful.",
    },
    {
      id: "automation",
      label: "Automation",
      title: "Less repetition. More progress.",
      copy: "We automate routine work so your team can focus on customers, decisions, and growth.",
    },
  ],
  cta: {
    title: "Start with the work you already repeat.",
    copy: "Tell us what you want to improve, automate, or create. We’ll help turn it into a practical digital solution.",
    label: "Get in touch",
  },
} as const;

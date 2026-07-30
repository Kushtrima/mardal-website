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
  overview: {
    title: "AI designed around real business work",
    columns: [
      "We start by understanding how work moves through your business: where information enters, who handles it, what decisions are repeated, and where delays happen. Then we build AI and automation that fit directly into that process.",
      "The result may be an assistant that answers customers, a workflow that processes documents, a voice agent that manages calls, or an automated system that moves work from one step to the next.",
      "Our goal is not to add AI everywhere. It is to use it where it saves time, improves consistency, and makes the process easier to manage.",
    ],
  },
  offerings: [
    {
      id: "ai-assistants",
      title: "AI Assistants",
      copy: "Custom AI agents that use your business knowledge, documents, and tools to support customers, employees, and everyday operations.",
      items: [
        "Customer questions and support",
        "Internal company knowledge",
        "Product and service information",
        "Document and policy search",
        "Employee assistance",
        "Personalized email and message preparation",
        "Multilingual communication",
        "Approved actions across business tools",
      ],
    },
    {
      id: "b2b-automation",
      title: "B2B Automation",
      copy: "Automated workflows that reduce manual work and move tasks through the business.",
      items: [
        "Lead capture and follow-up",
        "Enquiry to quotation",
        "Booking to confirmation",
        "Order to invoice",
        "Contract approvals",
        "Task creation and reminders",
        "Customer request routing",
        "Scheduled reports and notifications",
      ],
    },
  ],
  cta: {
    title: "Start with the work you already repeat.",
    copy: "Tell us what you want to improve, automate, or create. We’ll help turn it into a practical digital solution.",
    label: "Get in touch",
  },
} as const;

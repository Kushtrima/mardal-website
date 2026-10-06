/**
 * The services' page: the owner's list, and what each service says beside it.
 *
 * **The list is his, word for word** — owner, 2026-10-06: Creative, then
 * Development, then AI + Automation, in his order; renewed the same day
 * (seven, seven and five).
 *
 * **What each one says is his, word for word** — owner, 2026-10-06: a
 * paragraph and what it includes, for every service in the three groups. His
 * title lines over them came off the same day ("delete title for each … only
 * paragraf and other text"), and the word "Includes" over the list ("delete
 * text Include in all"). The AI + Automation five, written for him first at
 * his word, were replaced by his own the same day.
 */

import { contactEmail } from "./home";

/** The page's name in the tab, and its line for search results — what the
 *  placeholder said, without its count of seven (there are nineteen now). */
export const servicesPage = {
  title: "Services",
  description: "The services Mardal offers, in one place.",
} as const;

/**
 * The page's opening — the owner's comp of 2026-10-06 ("this is what we
 * need"): his words, and his breaks between the heading's lines.
 */
export const servicesHero = {
  label: "Service",
  titleLines: [
    "Mardal is a results-driven",
    "agency built for ambitious brands",
    "that refuse to settle",
    "for average",
  ],
  /* The heading's full stop, in the red — owner, 2026-10-06: "in the end
     the . to be in red". */
  titleStop: ".",
  note: "We don’t measure success in deliverables. We measure it in revenue grown, leads doubled, and brands that became impossible to ignore.",
} as const;

export type ServiceIndexEntry = {
  readonly group: string;
  readonly label: string;
  readonly summary?: string;
  readonly lists: readonly {
    readonly title?: string;
    readonly items: readonly string[];
  }[];
};

type Said = Pick<ServiceIndexEntry, "summary" | "lists">;

/** His own words for it: a paragraph, and what it includes. */
const written = (summary: string, includes: readonly string[]): Said => ({
  summary,
  lists: [{ items: includes }],
});

const LIST: readonly {
  readonly group: string;
  readonly services: readonly (readonly [string, Said])[];
}[] = [
  {
    group: "Creative",
    services: [
      [
        "Branding",
        written(
          "We help define what your brand stands for, how it should be positioned, and how it should communicate with the right audience. The goal is to create a strong strategic direction that makes every future design and communication decision more consistent.",
          [
            "Brand strategy",
            "Positioning",
            "Brand personality",
            "Naming",
            "Messaging & tone of voice",
            "Brand direction",
          ],
        ),
      ],
      [
        "Visual Identity",
        written(
          "We turn your brand strategy into a distinct visual language that works consistently across every touchpoint. From your logo and typography to colors, graphic elements, and brand applications, everything is designed to feel connected and unmistakably yours.",
          [
            "Logo design",
            "Color palette",
            "Typography",
            "Graphic elements",
            "Iconography",
            "Brand guidelines",
            "Templates & applications",
          ],
        ),
      ],
      [
        "UX/UI Design",
        written(
          "We combine user experience thinking with strong interface design to create websites, apps, platforms, and software that feel intuitive from the first interaction. Every screen is planned around clarity, usability, and the needs of the people using it.",
          [
            "User research",
            "Information architecture",
            "User flows",
            "Wireframes",
            "UI design",
            "Interactive prototypes",
            "Design systems",
            "Usability improvements",
          ],
        ),
      ],
      [
        "Web Design",
        written(
          "We design websites around your brand, your audience, and the goals your business needs to achieve. From structure and content hierarchy to responsive layouts and interaction, every part of the experience is considered before development begins.",
          [
            "Website structure",
            "UX planning",
            "Wireframes",
            "Responsive design",
            "Landing pages",
            "Interactive elements",
            "Design systems",
            "Developer-ready designs",
          ],
        ),
      ],
      [
        "Product Design",
        written(
          "We help shape digital products from early concepts through to detailed interfaces and prototypes. The process focuses on understanding user needs, defining the right features, and creating an experience that is practical, scalable, and easy to navigate.",
          [
            "Product discovery",
            "User journeys",
            "Feature planning",
            "User flows",
            "Wireframes",
            "UX/UI design",
            "Prototyping",
            "Design systems",
          ],
        ),
      ],
      [
        "Print Design",
        written(
          "We design print materials that extend your visual identity beyond digital channels. Whether it is a brochure, catalog, packaging, or signage, every piece is created to communicate clearly and stay aligned with your brand.",
          [
            "Brochures",
            "Catalogs",
            "Business cards",
            "Posters",
            "Flyers",
            "Packaging",
            "Signage",
            "Corporate materials",
          ],
        ),
      ],
      [
        "Social Media Design",
        written(
          "We design visual systems and campaign assets that help your brand communicate professionally across different platforms. The focus is on creating content that feels connected to your identity while remaining flexible enough for daily communication and campaigns.",
          [
            "Social media templates",
            "Post designs",
            "Story designs",
            "Campaign visuals",
            "Ad creatives",
            "Cover graphics",
            "Branded content",
            "Social media guidelines",
          ],
        ),
      ],
    ],
  },
  {
    group: "Development",
    services: [
      [
        "Websites",
        written(
          "We design and develop modern, responsive websites that are fast, easy to manage, and built around your business goals. From company websites and landing pages to more complex content-driven experiences, we focus on performance, usability, scalability, and a consistent experience across every device.",
          [
            "Corporate websites",
            "Landing pages",
            "Responsive development",
            "CMS integration",
            "Custom functionality",
            "Performance optimization",
            "SEO-ready structure",
            "Maintenance & support",
          ],
        ),
      ],
      [
        "Web Platforms",
        written(
          "We build custom web platforms for businesses that need more than a traditional website. These can include customer portals, internal tools, marketplaces, dashboards, booking systems, or other browser-based applications designed around specific business processes.",
          [
            "Customer portals",
            "Business dashboards",
            "Internal platforms",
            "Booking systems",
            "Marketplaces",
            "User accounts & permissions",
            "Admin panels",
            "Third-party integrations",
          ],
        ),
      ],
      [
        "Mobile Apps",
        written(
          "We create mobile applications that give users a simple, reliable experience on smartphones and tablets. From early product planning to development and launch, we build apps that connect with your existing systems and can evolve as your business grows.",
          [
            "iOS applications",
            "Android applications",
            "Cross-platform apps",
            "App UX/UI implementation",
            "User authentication",
            "Push notifications",
            "API integrations",
            "App maintenance & updates",
          ],
        ),
      ],
      [
        "Custom Software",
        written(
          "We develop software around the way your business actually operates instead of forcing your processes into generic tools. Whether you need an internal application, management system, operational tool, or completely new digital product, we design and build it around your requirements.",
          [
            "Business applications",
            "Internal management tools",
            "Operational software",
            "Custom dashboards",
            "Database solutions",
            "User roles & permissions",
            "Reporting tools",
            "Maintenance & ongoing development",
          ],
        ),
      ],
      [
        "CRM Solutions",
        written(
          "We help businesses bring customer information, sales, activities, service, and reporting into one structured environment. We can help you select and implement an existing CRM or build and customize a solution around the way your teams work.",
          [
            "CRM strategy",
            "CRM selection",
            "Implementation",
            "Customization",
            "Data migration",
            "Sales workflows",
            "Reporting & dashboards",
            "Integrations",
            "Training & support",
          ],
        ),
      ],
      [
        "E-commerce",
        written(
          "We build e-commerce experiences that connect the customer-facing store with the systems needed to run the business behind it. From products and payments to inventory, orders, delivery, and customer management, we create reliable digital commerce solutions that can scale.",
          [
            "Online stores",
            "Product catalogs",
            "Shopping cart & checkout",
            "Payment integration",
            "Customer accounts",
            "Inventory integration",
            "Order management",
            "Delivery integrations",
            "Analytics & reporting",
          ],
        ),
      ],
      [
        "API & Integrations",
        written(
          "We connect your applications, platforms, and business systems so information can move between them automatically. This reduces manual work, improves data consistency, and allows your existing tools to work together as one connected digital environment.",
          [
            "API development",
            "Third-party integrations",
            "CRM & ERP integrations",
            "Payment integrations",
            "Accounting integrations",
            "E-commerce integrations",
            "Data synchronization",
            "Authentication & security",
            "Integration maintenance",
          ],
        ),
      ],
    ],
  },
  {
    group: "AI + Automation",
    services: [
      [
        "AI Assistants",
        written(
          "We build AI assistants that help customers and teams find information, complete tasks, and get support faster. They can be connected to your website, internal knowledge, products, services, documents, or business systems, giving users a more natural way to interact with information.",
          [
            "Customer support assistants",
            "Internal knowledge assistants",
            "Website assistants",
            "Product & service information",
            "Document & policy search",
            "Employee support",
            "Multilingual support",
            "CRM and business system connections",
          ],
        ),
      ],
      [
        "AI Integrations",
        written(
          "We integrate AI into the tools and systems your business already uses, so you can add intelligent capabilities without replacing your existing technology. AI can help analyze information, generate content, classify data, summarize documents, support decisions, and improve everyday workflows.",
          [
            "AI API integrations",
            "CRM & ERP integration",
            "Website & platform integration",
            "Data analysis",
            "Document processing",
            "Content generation",
            "Classification & extraction",
            "Custom AI features",
          ],
        ),
      ],
      [
        "Workflow Automation",
        written(
          "We automate repetitive business processes so information, tasks, approvals, and documents can move between people and systems with less manual work. Workflows are designed around the way your business operates and can connect multiple applications into one coordinated process.",
          [
            "Business process automation",
            "Forms & data collection",
            "Document workflows",
            "Approval processes",
            "Email automation",
            "Task creation & assignment",
            "Notifications & reminders",
            "System-to-system workflows",
          ],
        ),
      ],
      [
        "Sales & CRM Automation",
        written(
          "We connect your sales processes with automation and AI to reduce repetitive administrative work and help teams respond faster. Leads, customer information, activities, follow-ups, opportunities, and internal notifications can be handled automatically while keeping your CRM up to date.",
          [
            "Lead capture",
            "CRM contact creation",
            "Lead assignment",
            "Follow-up automation",
            "Opportunity updates",
            "Sales reminders",
            "Email automation",
            "Manager notifications",
            "Reporting workflows",
          ],
        ),
      ],
      [
        "Customer Service Automation",
        written(
          "We automate repetitive customer service processes while keeping your team involved where human attention is needed. Requests can be collected, categorized, assigned, tracked, and escalated automatically, helping businesses respond more consistently and manage higher volumes of support.",
          [
            "Support request automation",
            "Ticket creation",
            "Request categorization",
            "Automatic assignment",
            "Confirmation messages",
            "Status updates",
            "Deadline tracking",
            "Escalations",
            "Feedback collection",
          ],
        ),
      ],
    ],
  },
];

export const servicesIndex: readonly ServiceIndexEntry[] = LIST.flatMap(
  (group) =>
    group.services.map(([label, said]) => ({ group: group.group, label, ...said })),
);

/**
 * The two ways in, under every service — owner, 2026-10-06: "to be write to
 * us and other Book a meeting so two buttons". Write to us is the contact
 * page's letter. Book a meeting has no booking page to go to yet, so it opens
 * a letter to the studio's address that says what it is for; when there is a
 * calendar link, it goes here.
 */
export const servicesIndexActions = [
  { label: "Write to us", href: "/contact" },
  {
    label: "Book a meeting",
    href: `mailto:${contactEmail}?subject=${encodeURIComponent("Book a meeting")}`,
  },
] as const;

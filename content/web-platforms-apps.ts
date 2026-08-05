/**
 * Copy for the Web Platforms & Apps service page.
 *
 * Same shape as the other four service pages. Four chapters, each one an entry
 * in the left-hand nav, and each holding only the services that belong to it:
 * design before the build, everything that runs in a browser, everything that
 * runs on a phone, and how AI is built into the product itself. Each service is
 * a capability sentence, the actions it covers, and one worked example.
 *
 * Launch and growth is deliberately one card inside Mobile Apps rather than a
 * chapter of its own.
 */
export const webPlatformsApps = {
  title: "Web Platforms & Apps",
  description:
    "Websites, online stores, portals, and mobile apps, built for the people who use them.",
  /* Kept to the length the other service heroes use -- their first lines run
     14 to 18 characters, and the previous 22-character line wrapped to three
     visual lines instead of the two it was written as. */
  heroTitleLines: ["Web and mobile", "people rely on."],
  support: "Websites, online stores, portals, and mobile apps.",
  heroCta: "Let’s build",
  chapters: [
    {
      id: "product-design",
      title: "Product Design",
      description:
        "Decide how a product looks and works before development begins, while changes are still inexpensive.",
      services: [
        {
          id: "interface-design",
          title: "Interface Design",
          copy: "We design the screens people use, working from your content and the tasks your customers need to complete.",
          items: [
            "Design screens for desktop and mobile",
            "Set layout, type, colour, and spacing",
            "Build a component library the site reuses",
            "Document the design so it can be extended",
          ],
          example:
            "A service company needs a booking screen. It is designed for phone and desktop first, then handed to development as a component the rest of the site can reuse.",
        },
        {
          id: "prototypes-testing",
          title: "Prototypes & Testing",
          copy: "We build clickable prototypes so a product can be reviewed and corrected before any code is written.",
          items: [
            "Create clickable prototypes",
            "Test the main tasks with real users",
            "Record where people hesitate or stop",
            "Correct the design before development",
          ],
          example:
            "A checkout is tested with a small group before it is built. Two steps cause hesitation, and both are redesigned before development starts.",
        },
        {
          id: "content-structure",
          title: "Content & Structure",
          copy: "We organize the pages, navigation, and content of a site so visitors can find what they need without guessing.",
          items: [
            "Plan pages and navigation",
            "Structure content for each audience",
            "Define what each page has to answer",
            "Prepare content for more than one language",
          ],
          example:
            "A company’s service pages have grown without a plan. The pages are grouped by what a visitor is trying to do, and the navigation is rebuilt around those groups.",
        },
      ],
    },
    {
      id: "web-platforms",
      title: "Web Platforms",
      description:
        "Everything that runs in a browser, from a company website to an application your team uses all day.",
      services: [
        {
          id: "business-websites",
          title: "Business Websites",
          copy: "We build company websites your team can update, in the languages your customers read.",
          items: [
            "Build pages from a reusable component set",
            "Give your team a place to edit content",
            "Publish in more than one language",
            "Connect forms to email or your CRM",
          ],
          example:
            "A company publishes a new service page. It is written and translated by the team that owns the content, and goes live without a developer.",
        },
        {
          id: "online-stores",
          title: "Online Stores",
          copy: "We build online stores that handle catalogue, checkout, payment, and delivery without manual work between them.",
          items: [
            "Build catalogue, search, and product pages",
            "Set up checkout, payment, and tax rules",
            "Connect stock, delivery, and returns",
            "Support discounts, accounts, and repeat orders",
          ],
          example:
            "A customer completes an order. Stock is reduced, the delivery is prepared, and the order appears in the systems the team already uses.",
        },
        {
          id: "customer-portals",
          title: "Customer Portals",
          copy: "We build the part of a site your customers sign in to, so they can serve themselves instead of emailing your team.",
          items: [
            "Give customers accounts and secure sign-in",
            "Show orders, documents, and invoices",
            "Take requests, bookings, and updates",
            "Control what each customer can see",
          ],
          example:
            "A customer needs a copy of an old invoice. They sign in and download it themselves, and nobody in the office has to look it up.",
        },
        {
          id: "web-applications",
          title: "Web Applications",
          copy: "We build browser applications for work a website cannot carry: many records, several roles, and daily use.",
          items: [
            "Build dashboards and internal tools",
            "Add roles, permissions, and audit records",
            "Handle long lists, search, and filtering",
            "Keep the interface fast as records grow",
          ],
          example:
            "A team manages requests in a shared spreadsheet. The work moves into a browser application where each role sees only the records it is allowed to open.",
        },
      ],
    },
    {
      id: "mobile-apps",
      title: "Mobile Apps",
      description:
        "Apps for phones and tablets, for your customers or for your own team.",
      services: [
        {
          id: "current-technology",
          title: "Current Technology",
          copy: "We build for the iOS and Android versions people are actually running, on frameworks that are still actively maintained, so an app does not need rebuilding when the platforms move on.",
          items: [
            "Build for current iOS and Android versions",
            "Use frameworks that are actively maintained",
            "Share one codebase where both platforms allow it",
            "Update the app as the platforms change",
          ],
          example:
            "A new phone operating system changes how an app stores files. The app is updated and released before the previous behaviour stops working.",
        },
        {
          id: "apps-across-industries",
          title: "Across Industries",
          copy: "We build apps for the sector you work in, shaped around the records, rules, and steps your own work uses.",
          items: [
            "Shape the app around how your sector works",
            "Handle the records and rules your field requires",
            "Connect to the systems common in your industry",
            "Support the languages your users need",
          ],
          example:
            "A delivery company and a clinic both need an app for staff on the move. Each is built around the records, permissions, and steps its own work requires.",
        },
        {
          id: "offline-apps",
          title: "Offline Apps",
          copy: "We build apps that keep working with no connection, and send what they collected as soon as there is one.",
          items: [
            "Work with no signal and synchronize later",
            "Store information on the device safely",
            "Use the camera, scanner, and location",
            "Avoid duplicates when records arrive late",
          ],
          example:
            "A technician records a job on a phone with no signal. The record is stored on the device and reaches the office system as soon as the connection returns.",
        },
        {
          id: "app-launch-growth",
          title: "Launch & Growth",
          copy: "We publish the app, keep it working after release, and improve it once people are using it.",
          items: [
            "Publish to the App Store and Google Play",
            "Monitor availability, errors, and crashes",
            "Fix problems and restore from backups",
            "Plan and release improvements",
          ],
          example:
            "A release introduces an error on one model of phone. Monitoring reports it, the previous version is restored, and the fix is released after testing.",
        },
      ],
    },
    {
      id: "ai-powered",
      title: "AI-Powered",
      description:
        "How AI is built into the site or app itself, so the product does more of the work for the people using it.",
      services: [
        {
          id: "ai-search-recommendations",
          title: "Search & Recommendations",
          copy: "We build search that understands what someone is asking for, and suggests what is worth showing next.",
          items: [
            "Search products and pages in plain language",
            "Rank results by what people actually choose",
            "Suggest related and alternative items",
            "Explain why a result was suggested",
          ],
          example:
            "A visitor describes what they need instead of naming a product. The store returns the closest matches, and the alternatives most often chosen with them.",
        },
        {
          id: "ai-personalization",
          title: "Personalization",
          copy: "We adapt what each person sees to what they have looked at, ordered, or asked for before.",
          items: [
            "Show returning visitors relevant content first",
            "Sort products and pages for each visitor",
            "Group people by behaviour rather than guesswork",
            "Let your team override what is shown",
          ],
          example:
            "A returning customer opens the store. The categories they order from most appear first, and a promotion they have already used is not shown again.",
        },
        {
          id: "ai-camera-voice-input",
          title: "Camera & Voice Input",
          copy: "We let people photograph, scan, or speak instead of typing, and turn what they capture into information your systems can use.",
          items: [
            "Identify products and parts from a photo",
            "Read text from labels and photographed documents",
            "Turn spoken notes into structured records",
            "Mark uncertain results for review",
          ],
          example:
            "A technician photographs a damaged part in the app. The part is identified, the job record is filled in, and anything uncertain is marked for an employee to confirm.",
        },
        {
          id: "ai-content-assistance",
          title: "Content Assistance",
          copy: "We take the repetitive part of publishing off the team that owns your content.",
          items: [
            "Draft product and page descriptions",
            "Translate content into other languages",
            "Write image alt text and page summaries",
            "Keep a person in the approval step",
          ],
          example:
            "A new product is added with a batch of images. Descriptions, translations, and alt text are prepared automatically, and an employee approves them before publishing.",
        },
      ],
    },
  ],
  cta: {
    title: "Let’s build\nwhat your business\nneeds next.",
    label: "Get in touch",
  },
} as const;

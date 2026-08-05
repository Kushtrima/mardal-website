/**
 * Copy for the Web Platforms & Apps service page.
 *
 * Same shape as the other four service pages. Four chapters, each one an entry
 * in the left-hand nav, and each holding only the services that belong to it:
 * design before the build, everything that runs in a browser, everything that
 * runs on a phone, and what happens after launch. Each service is a capability
 * sentence, the actions it covers, and one worked example.
 */
export const webPlatformsApps = {
  title: "Web Platforms & Apps",
  description:
    "Web platforms and mobile apps designed to be fast, intuitive, and ready to grow.",
  heroTitleLines: [
    "Web platforms and apps",
    "people want to use.",
  ],
  support: "Fast, intuitive digital products built to grow.",
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
        "Everything that runs on a phone or tablet, for work that happens away from a desk.",
      services: [
        {
          id: "ios-android-apps",
          title: "iOS & Android",
          copy: "We build mobile apps for iOS and Android, shaped around the tasks people complete on a phone.",
          items: [
            "Build for iOS and Android",
            "Design for touch and small screens",
            "Add accounts, roles, and permissions",
            "Connect to your existing business systems",
          ],
          example:
            "A company gives its field team an app. The same app runs on iPhone and Android, and every job it records appears in the office system.",
        },
        {
          id: "device-offline",
          title: "Device & Offline",
          copy: "We use what the phone can already do, and keep the app working when there is no connection.",
          items: [
            "Work offline and synchronize when connected",
            "Use the camera, scanner, and location",
            "Send notifications for time-sensitive work",
            "Store information on the device safely",
          ],
          example:
            "An employee records a job on a phone with no signal. The record is stored on the device and sent to the office system as soon as the connection returns.",
        },
        {
          id: "app-release-updates",
          title: "Release & Updates",
          copy: "We publish the app, keep it accepted by the stores, and release changes without interrupting the people using it.",
          items: [
            "Publish to the App Store and Google Play",
            "Manage versions and staged releases",
            "Monitor crashes and failed updates",
            "Keep the app working across operating system versions",
          ],
          example:
            "A new phone operating system changes how an app stores files. The app is updated and released before the previous behaviour stops working.",
        },
      ],
    },
    {
      id: "launch-growth",
      title: "Launch & Growth",
      description:
        "Prepare a product for launch, keep it fast and reachable, and improve it once people are using it.",
      services: [
        {
          id: "performance-accessibility",
          title: "Performance & Accessibility",
          copy: "We make a product load quickly and work on any device, including for people using assistive technology.",
          items: [
            "Reduce loading time and page weight",
            "Test on phones, tablets, and slower connections",
            "Meet recognized accessibility standards",
            "Check colour contrast and keyboard use",
          ],
          example:
            "A product page takes too long to open on a phone. Images, fonts, and scripts are reduced, and the page becomes usable on a slow connection.",
        },
        {
          id: "search-analytics",
          title: "Search & Analytics",
          copy: "We prepare a site to be found and measured, so decisions after launch are based on what visitors actually do.",
          items: [
            "Set page titles, descriptions, and structured data",
            "Publish sitemaps and control indexing",
            "Set up analytics and conversion tracking",
            "Report on what visitors do and where they stop",
          ],
          example:
            "A company cannot tell which pages bring enquiries. Tracking is added to the contact steps, and the pages that produce enquiries become visible.",
        },
        {
          id: "maintenance-support",
          title: "Maintenance & Support",
          copy: "We keep a site or app working after launch, with updates, monitoring, and a clear route for reporting problems.",
          items: [
            "Apply security and platform updates",
            "Monitor availability and errors",
            "Fix problems and restore from backups",
            "Plan and release improvements",
          ],
          example:
            "An error appears after a platform update. Monitoring reports it the same day, the previous version is restored, and the fix is released after testing.",
        },
      ],
    },
  ],
  cta: {
    title: "Let’s build\nwhat your business\nneeds next.",
    label: "Get in touch",
  },
} as const;

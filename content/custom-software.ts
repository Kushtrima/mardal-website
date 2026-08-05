/**
 * The Custom Software service page.
 *
 * The three chapters are organized by client intention: build for employees,
 * build for customers, or improve software that already exists.
 */
export const customSoftware = {
  title: "Custom Software",
  description:
    "Custom apps, platforms, and internal tools designed around how your business works.",
  heroTitleLines: [
    "Build the software",
    "your business actually needs.",
  ],
  support: "Custom apps, platforms, and tools made for your team.",
  heroCta: "Let’s build",
  overview: {
    title: "When standard software no longer fits",
    columns: [
      "Custom software is built for a specific business need. It is the right choice when ready-made products force your team into workarounds, leave important steps outside the system, or cannot support a new service.",
      "We design internal tools, customer portals, web platforms, mobile apps, and operational systems around the people who will use them and the work they need to complete.",
      "We can build a new product, replace older software, or extend what already exists. Each project covers planning, design, development, testing, launch, and ongoing improvement.",
    ],
  },
  chapters: [
    {
      id: "for-your-team",
      title: "For Your Team",
      description:
        "Software designed around the work your employees manage every day, especially when standard tools or spreadsheets no longer fit.",
      services: [
        {
          id: "internal-tools",
          title: "Internal Tools",
          copy: "Custom applications that bring daily work, records, responsibilities, and decisions into one clear place.",
          items: [
            "Replace complex spreadsheets and shared files",
            "Manage requests, cases, jobs, and tasks",
            "Create clear views for different teams and roles",
            "Track status, ownership, and deadlines",
          ],
          example:
            "A service company replaces several spreadsheets and email chains with one internal application where employees manage jobs, assign responsibility, record progress, and see what needs attention.",
        },
        {
          id: "operations-software",
          title: "Operations Software",
          copy: "Complete software for managing the core process that makes your business different, from planning and delivery to completion and review.",
          items: [
            "Build around your own process and business rules",
            "Manage orders, jobs, assets, inventory, or resources",
            "Coordinate teams, locations, and responsibilities",
            "See progress, workload, and bottlenecks",
          ],
          example:
            "A manufacturer manages production jobs, materials, quality checks, and team handovers in one system built around its exact operating process.",
        },
        {
          id: "planning-scheduling",
          title: "Planning & Scheduling",
          copy: "Purpose-built tools for planning people, equipment, appointments, shifts, and work across the time and capacity available.",
          items: [
            "Manage calendars, availability, and capacity",
            "Assign employees, equipment, and locations",
            "Plan routes, shifts, appointments, and deadlines",
            "Handle changes, conflicts, and rescheduling",
          ],
          example:
            "A maintenance company schedules technicians according to availability, location, and required skills, then gives each technician a clear view of the work assigned to them.",
        },
      ],
    },
    {
      id: "for-your-customers",
      title: "For Your Customers",
      description:
        "Digital services that give customers, partners, or members a simple way to work with your business online.",
      services: [
        {
          id: "customer-portals",
          title: "Customer Portals",
          copy: "Secure online spaces where customers can view information, send requests, share documents, and follow progress without contacting your team for every update.",
          items: [
            "Provide secure accounts and role-based access",
            "Show services, documents, orders, or active cases",
            "Collect information, files, and customer requests",
            "Share messages, progress, and important updates",
          ],
          example:
            "A client signs in to view an active project, upload requested documents, approve a quotation, and follow the next milestones from one place.",
        },
        {
          id: "booking-service-apps",
          title: "Booking & Service Apps",
          copy: "Web and mobile applications that let customers find, book, manage, and pay for services whenever it suits them.",
          items: [
            "Show services, availability, locations, and prices",
            "Accept bookings, changes, and cancellations",
            "Collect customer details and payments securely",
            "Provide confirmations, reminders, and service updates",
          ],
          example:
            "A customer chooses a service, finds an available appointment, pays online, and later reschedules the booking without calling the business.",
        },
        {
          id: "web-mobile-products",
          title: "Web & Mobile Products",
          copy: "New digital products and platforms built for customers, members, partners, or a new business idea.",
          items: [
            "Turn a service idea into a usable digital product",
            "Create membership and subscription platforms",
            "Build self-service tools and online marketplaces",
            "Support web, mobile, and future product growth",
          ],
          example:
            "A new business turns its service idea into a customer-facing platform with user accounts, subscriptions, online payments, and self-service tools.",
        },
      ],
    },
    {
      id: "existing-software",
      title: "Existing Software",
      description:
        "Improve software you already use so it remains useful, reliable, and ready for the next stage of your business.",
      services: [
        {
          id: "software-modernization",
          title: "Software Modernization",
          copy: "Update older software that is slow, difficult to maintain, or no longer meets business needs without losing the useful processes and information inside it.",
          items: [
            "Replace outdated interfaces and technology",
            "Improve speed, security, and reliability",
            "Make software easier to use on modern devices",
            "Move important information into the renewed system",
          ],
          example:
            "An older desktop application is rebuilt as a modern web application while preserving the company’s records, business rules, and essential daily processes.",
        },
        {
          id: "new-features",
          title: "New Features",
          copy: "Add capabilities to software that already works but needs to support new services, users, or business processes.",
          items: [
            "Add new workflows, records, and user roles",
            "Create customer or employee self-service features",
            "Improve search, reporting, and document handling",
            "Extend the software without rebuilding everything",
          ],
          example:
            "A business adds a customer account area, online payments, and document approval to an existing platform instead of replacing the full system.",
        },
        {
          id: "support-maintenance",
          title: "Support & Maintenance",
          copy: "Keep custom software stable after launch and improve it as users, technology, and business needs change.",
          items: [
            "Monitor performance and resolve issues",
            "Apply security and technology updates",
            "Test and release improvements safely",
            "Plan ongoing changes with a clear product roadmap",
          ],
          example:
            "After a new platform goes live, we monitor it, fix problems, release approved improvements, and help the business plan the next useful features.",
        },
      ],
    },
  ],
  cta: {
    title: "Let’s build\nwhat your business\nneeds next.",
    label: "Get in touch",
  },
} as const;

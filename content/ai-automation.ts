/**
 * The AI & Automation service page.
 *
 * Service positioning and capability copy approved for the page.
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
      "Each solution connects with the business systems, approved information, and digital tools your team already uses. We apply AI where it saves time, improves consistency, and makes work easier to manage.",
    ],
  },
  chapters: [
    {
      id: "ai-applications",
      title: "AI Applications",
      navLabel: "AI Applications",
      services: [
        {
          id: "ai-assistants",
          title: "AI Assistants",
          copy: "User-facing AI tools that help customers and employees ask questions, find information, and complete everyday tasks using approved business content.",
          items: [
            "Answer customer questions",
            "Explain products and services",
            "Search internal documents and policies",
            "Support communication in multiple languages",
          ],
          example:
            "A customer asks about pricing, delivery, or a service. The assistant finds the relevant information and responds directly or directs the request to the appropriate employee.",
        },
        {
          id: "document-intelligence",
          title: "Document Intelligence",
          copy: "AI that reads, extracts, and organizes information from invoices, contracts, forms, applications, and other business documents.",
          items: [
            "Extract names, dates, totals, and reference numbers",
            "Classify and organize documents",
            "Identify missing or inconsistent information",
            "Summarize and compare document content",
          ],
          example:
            "An invoice arrives by email. AI extracts the supplier, invoice number, date, and total, then prepares the information for accounting review.",
        },
        {
          id: "ai-data-insights",
          title: "AI Data & Insights",
          copy: "AI that analyzes current and historical business data to explain what happened, why it happened, and where attention is needed.",
          items: [
            "Summarize current and past performance",
            "Explain the causes behind trends and changes",
            "Analyze customer feedback",
            "Answer questions about business performance",
          ],
          example:
            "AI reviews weekly sales data and explains why conversion changed, which products drove the result, and where performance needs attention.",
        },
      ],
    },
    {
      id: "automation-solutions",
      title: "Automation Solutions",
      navLabel: "Automation",
      description:
        "Connected workflows that reduce repetitive work, improve response times, and keep business processes moving.",
      services: [
        {
          id: "sales-crm-automation",
          title: "Sales & CRM Automation",
          copy: "Automated workflows that help sales teams capture leads, manage opportunities, and follow up consistently.",
          items: [
            "Capture leads from websites, forms, and email",
            "Create contacts and opportunities in the CRM",
            "Assign leads to the appropriate salesperson",
            "Create follow-up tasks, reminders, and notifications",
          ],
          example:
            "A potential client submits a website form. The lead is added to the CRM, assigned to a salesperson, and a follow-up task is created automatically.",
        },
        {
          id: "customer-service-automation",
          title: "Customer Service Automation",
          copy: "Automated workflows that organize customer requests, assign responsibility, and keep customers informed.",
          items: [
            "Create support tickets from forms, emails, or messages",
            "Categorize and assign customer requests",
            "Track response and resolution deadlines",
            "Send confirmations and status updates",
          ],
          example:
            "A customer submits a support request. A ticket is created, the responsible team is notified, and the customer receives confirmation immediately.",
        },
        {
          id: "document-approval-automation",
          title: "Document & Approval Automation",
          copy: "Structured workflows that route documents and internal requests through review, approval, signing, and storage after the required information has been collected.",
          items: [
            "Collect and organize documents automatically",
            "Assign review and approval tasks",
            "Track decisions, deadlines, and document status",
            "Store approved and signed documents",
          ],
          example:
            "A contract is submitted for approval. The responsible manager receives a review task, the decision is recorded, and the signed document is stored in the correct location.",
        },
        {
          id: "order-operations-automation",
          title: "Order & Operations Automation",
          copy: "Automated workflows that connect orders with inventory, invoicing, delivery, and internal operational teams.",
          items: [
            "Register and process new orders",
            "Update inventory and stock levels",
            "Notify warehouse or fulfilment teams",
            "Send order and delivery updates",
          ],
          example:
            "When an online order is placed, inventory is updated, the warehouse receives a fulfilment task, and the customer receives an order confirmation.",
        },
        {
          id: "reporting-alerts",
          title: "Reporting & Alerts",
          copy: "Automated workflows that collect agreed metrics and deliver scheduled reports or alerts without requiring manual preparation.",
          items: [
            "Generate and send scheduled reports",
            "Collect agreed metrics from connected systems",
            "Notify teams about deadlines and overdue tasks",
            "Alert managers to unusual activity or important changes",
          ],
          example:
            "Every Monday, management receives an automatic summary of new leads, open opportunities, completed sales, and overdue follow-ups.",
        },
      ],
    },
    {
      id: "ai-systems",
      title: "AI Systems",
      navLabel: "AI Systems",
      description:
        "Advanced AI technologies for projects that need company knowledge, forecasting, visual recognition, or production-grade control.",
      services: [
        {
          id: "rag-knowledge-systems",
          title: "RAG & Knowledge Systems",
          copy: "The knowledge layer behind AI assistants and search tools. It retrieves approved company information before answering and shows the sources used.",
          items: [
            "Connect approved documents and company knowledge",
            "Find the most relevant information for each question",
            "Provide answers with supporting sources",
            "Reduce unsupported or invented responses",
          ],
          example:
            "An employee asks about a company policy. The system searches the approved policy library, returns a clear answer, and shows the documents used to produce it.",
        },
        {
          id: "predictive-analytics",
          title: "Predictive Analytics",
          copy: "AI systems that use historical and current data to forecast what may happen next, including changes in demand, risk, delays, or performance.",
          items: [
            "Forecast demand and business performance",
            "Detect unusual patterns and emerging risks",
            "Predict delays, failures, or maintenance needs",
            "Support planning with data-based forecasts",
          ],
          example:
            "A forecasting system analyzes previous orders and recent sales activity, then highlights expected demand changes so the team can adjust purchasing and staffing earlier.",
        },
        {
          id: "computer-vision",
          title: "Computer Vision",
          copy: "AI systems that analyze images and video to recognize objects, find defects, and monitor visual conditions automatically.",
          items: [
            "Spot defects and unusual visual changes",
            "Recognize products, materials, and events",
            "Analyze images and video in real time",
            "Route uncertain cases to an employee",
          ],
          example:
            "A camera inspects products as they move through production. The system flags visual defects, records the result, and sends uncertain cases to an employee for review.",
        },
        {
          id: "ai-governance-mlops",
          title: "AI Governance & Operations",
          copy: "Tools and processes that monitor, update, document, and control AI systems after launch. This operational discipline is often called MLOps.",
          items: [
            "Track AI quality and system health",
            "Test and approve updates before release",
            "Keep records of decisions and data use",
            "Support responsible AI and regulatory readiness",
          ],
          example:
            "A business-critical AI service is continuously checked for quality changes. When performance drops, the team receives an alert, reviews the evidence, and approves a tested update.",
        },
      ],
    },
  ],
  cta: {
    title: "Let’s build\nwhat your business\nneeds next.",
    label: "Get in touch",
  },
} as const;

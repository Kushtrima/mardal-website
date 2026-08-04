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
      "Our goal is not to add AI everywhere. It is to use it where it saves time, improves consistency, and makes the process easier to manage.",
    ],
  },
  chapters: [
    {
      id: "ai-solutions",
      title: "AI Solutions",
      services: [
        {
          id: "ai-assistants",
          title: "AI Assistants",
          copy: "Custom AI assistants that use your approved business information to help customers and employees find accurate answers quickly.",
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
          copy: "AI systems that read, understand, and organize information from invoices, contracts, forms, applications, and other business documents.",
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
          copy: "AI solutions that help businesses understand sales, customer, financial, and operational data more clearly.",
          items: [
            "Summarize business performance",
            "Identify trends and important changes",
            "Analyze customer feedback",
            "Prepare clear management reports",
          ],
          example:
            "At the end of each week, AI analyzes sales data and produces a summary of performance, lost opportunities, unusual changes, and areas requiring attention.",
        },
        {
          id: "ai-integration",
          title: "AI Integration",
          copy: "AI solutions connected to your existing business systems, information, and digital tools.",
          items: [
            "Connect AI with CRM and ERP systems",
            "Access approved databases and documents",
            "Integrate AI into websites and customer portals",
            "Connect internal applications through APIs",
          ],
          example:
            "An AI assistant connected to the company CRM can answer a customer’s question, retrieve relevant account information, and prepare the next action for employee approval.",
        },
      ],
    },
    {
      id: "automation-solutions",
      title: "Automation Solutions",
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
          copy: "Structured workflows that manage documents and internal requests through review, approval, signing, and storage.",
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
          copy: "Automated workflows that generate business reports and notify teams about performance, deadlines, and important changes.",
          items: [
            "Generate scheduled performance reports",
            "Collect information from connected systems",
            "Notify teams about deadlines and overdue tasks",
            "Alert managers to unusual activity or important changes",
          ],
          example:
            "Every Monday, management receives an automatic summary of new leads, open opportunities, completed sales, and overdue follow-ups.",
        },
      ],
    },
  ],
  advancedCapabilities: {
    eyebrow: "Specialized AI systems",
    title: "Five capabilities for more demanding AI work.",
    intro:
      "For projects that need deeper intelligence, stronger governance, or real-time decision-making, we design focused AI systems around the work they need to perform.",
    items: [
      {
        id: "tailored-ai-solutions",
        category: "Custom",
        title: "Tailored AI Solutions",
        copy: "We develop custom AI applications, dashboards, and portal solutions that integrate directly with your existing system landscape.",
        points: [
          "Proprietary model development",
          "Tailored UX/UI",
          "GDPR-compliant architecture",
        ],
      },
      {
        id: "rag-systems",
        category: "Knowledge",
        title: "RAG Systems & Reliable AI",
        copy: "With Retrieval-Augmented Generation, we anchor LLMs in your own data and documents for reliable answers without hallucinations.",
        points: [
          "Secure vector databases",
          "Zero-hallucination architecture",
          "Automated information extraction",
        ],
      },
      {
        id: "predictive-analytics",
        category: "Analytics",
        title: "Predictive Analytics & Forecasting",
        copy: "Proactive decisions instead of reaction: predictive models detect failures, risks, and trends early based on your data.",
        points: [
          "Predictive maintenance for industry",
          "Supply chain optimisation",
          "Automated anomaly detection",
        ],
      },
      {
        id: "enterprise-mlops",
        category: "Enterprise",
        title: "Enterprise MLOps & Governed AI",
        copy: "We ensure stable ML pipelines, monitoring, model updates, and auditability—the foundation for productive AI at scale.",
        points: [
          "Continuous model monitoring",
          "Automated CI/CD pipelines",
          "Full AI Act compliance",
        ],
      },
      {
        id: "computer-vision",
        category: "Perception",
        title: "Computer Vision & Edge AI",
        copy: "Deep-learning-based image recognition for defect detection, quality control, and process optimisation—in real time and with the highest precision.",
        points: [
          "Real-time inference at the edge",
          "Sub-millimetre precision",
          "Automated classification",
        ],
      },
    ],
  },
  cta: {
    title: "Let’s build\nwhat your business\nneeds next.",
    label: "Get in touch",
  },
} as const;

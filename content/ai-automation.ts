/**
 * The AI & Automation service page.
 *
 * Service positioning and capability copy approved for the page.
 */
export const aiAutomation = {
  slug: "ai-automation",
  eyebrow: "Mardal Services",
  title: "AI & Automation",
  year: "2026",
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
      id: "ai-solutions",
      title: "AI Solutions",
      kind: "group",
    },
    {
      id: "ai-assistants",
      title: "AI Assistants",
      copy: "Custom assistants that use your approved business information to answer questions and help customers or employees find what they need.",
      items: [
        "Answering customer questions on your website",
        "Explaining products and services",
        "Searching company documents and internal policies",
        "Helping employees find procedures and information",
        "Preparing answers based on your company’s knowledge",
        "Supporting communication in multiple languages",
      ],
      example:
        "A customer asks about pricing, delivery, or a service. The assistant searches the company’s approved information and provides a relevant answer or directs the request to an employee.",
    },
    {
      id: "document-processing",
      title: "Document Processing",
      copy: "AI systems that read documents and convert unstructured information into usable business data.",
      items: [
        "Extracting information from invoices, forms, and applications",
        "Identifying names, dates, totals, products, and reference numbers",
        "Classifying documents by type",
        "Detecting missing information",
        "Summarizing contracts or long documents",
        "Comparing document versions",
        "Preparing extracted information for review or entry into another system",
      ],
      example:
        "An invoice arrives by email. AI reads the supplier, invoice number, date, and total, then prepares the information for approval or accounting.",
    },
    {
      id: "ai-support",
      title: "AI Support",
      copy: "AI tools that help teams prepare clear and consistent business communication.",
      items: [
        "Customer email drafts",
        "Personalized replies",
        "Follow-up messages",
        "Product and service descriptions",
        "Translations and language adaptation",
        "Meeting and conversation summaries",
        "Reports created from existing information",
        "Rewriting content according to the company’s tone",
      ],
      example:
        "After a meeting, the system prepares a summary, identifies the agreed actions, and drafts a follow-up email for employee approval.",
    },
    {
      id: "ai-data-analysis",
      title: "AI Data Analysis",
      copy: "AI tools that help businesses understand operational, sales, and customer data.",
      items: [
        "Summarizing sales performance",
        "Identifying changes and trends",
        "Analyzing customer feedback",
        "Comparing results between periods",
        "Highlighting unusual activity",
        "Preparing management reports",
        "Explaining data in clear language",
        "Suggesting areas that may require attention",
      ],
      example:
        "At the end of each week, the system analyzes sales data and produces a report showing performance, lost opportunities, and important changes.",
    },
    {
      id: "automation-solutions",
      title: "Automation Solutions",
      kind: "group",
    },
    {
      id: "lead-sales-automation",
      title: "Lead & Sales\nAutomation",
      copy: "Automated workflows that help sales teams respond faster, manage leads consistently, and prevent opportunities from being missed.",
      items: [
        "Capture leads from websites, forms, email, and other channels",
        "Create contacts and sales opportunities in the CRM",
        "Assign leads to the appropriate salesperson",
        "Create follow-up tasks and reminders",
        "Send confirmation and follow-up emails",
        "Update lead and opportunity statuses",
        "Notify managers when a lead has not been contacted",
        "Prepare customer information for quotations",
      ],
      example:
        "A potential client submits a website form. The lead is automatically added to the CRM, assigned to the appropriate salesperson, and a follow-up task is created.",
      layout: "dense",
    },
    {
      id: "customer-service-automation",
      title: "Customer Service Automation",
      copy: "Workflows that organize incoming customer requests, assign responsibility, track response times, and keep customers informed.",
      items: [
        "Create support tickets from forms, emails, or messages",
        "Categorize requests by topic, urgency, or department",
        "Assign tickets to the appropriate team member",
        "Send automatic receipt confirmations",
        "Set response and resolution deadlines",
        "Escalate overdue or unresolved requests",
        "Notify customers when the status changes",
        "Close completed requests",
        "Collect customer feedback after resolution",
      ],
      example:
        "A customer submits a support request. A ticket is created automatically, the responsible department is notified, and the customer receives confirmation that the request has been received.",
      layout: "dense",
    },
    {
      id: "document-workflow-automation",
      title: "Document Workflow Automation",
      copy: "Automated workflows that move documents through collection, review, approval, signing, organization, and storage.",
      items: [
        "Collect documents from email, forms, or connected systems",
        "Rename and organize files automatically",
        "Send documents to the appropriate reviewer",
        "Create review and approval tasks",
        "Notify responsible employees",
        "Track document and approval statuses",
        "Send reminders for missing documents or delayed decisions",
        "Archive approved and signed documents",
        "Generate final documents from approved information",
      ],
      example:
        "A contract is submitted for approval. The responsible manager receives a review task, the approval status is tracked, and the signed version is stored in the correct location.",
      layout: "dense",
    },
    {
      id: "order-operations-automation",
      title: "Order & Operations Automation",
      copy: "Workflows that connect orders with inventory, invoicing, delivery, and internal operational teams.",
      items: [
        "Register new orders automatically",
        "Update inventory and stock levels",
        "Notify the warehouse or fulfilment team",
        "Prepare information for invoicing",
        "Update order and delivery statuses",
        "Send order confirmations to customers",
        "Create packing, delivery, or fulfilment tasks",
        "Notify teams when stock is running low",
        "Synchronize order information across connected systems",
      ],
      example:
        "When an online order is placed, the stock level is updated, the warehouse receives a fulfilment task, and the customer receives an order confirmation.",
      layout: "dense",
    },
    {
      id: "internal-approval-workflows",
      title: "Internal Approval Workflows",
      copy: "Structured workflows for business requests and decisions that require internal review or authorization.",
      items: [
        "Quotation approvals",
        "Purchase requests",
        "Contract reviews",
        "Expense approvals",
        "Employee requests",
        "Application reviews",
        "Document approvals",
        "Task assignment",
        "Deadline reminders",
        "Escalation to managers",
      ],
      example:
        "An employee submits a purchase request. It is automatically sent to the appropriate manager, the decision is recorded, and the employee is notified of the outcome.",
      layout: "dense",
    },
    {
      id: "reporting-notification-automation",
      title: "Reporting & Notification Automation",
      copy: "Automated workflows that collect business information, generate reports, and keep teams informed about performance, deadlines, and required actions.",
      items: [
        "Generate daily, weekly, or monthly reports",
        "Collect data from connected business systems",
        "Send performance summaries to selected recipients",
        "Notify teams about upcoming deadlines",
        "Alert managers to unusual activity or important changes",
        "Remind employees about incomplete or overdue tasks",
        "Distribute reports automatically",
        "Update dashboards with the latest information",
      ],
      example:
        "Every Monday, management receives an automatic summary of new leads, open opportunities, completed sales, and overdue follow-ups.",
      layout: "dense",
    },
  ],
  cta: {
    title: "Start with the work you already repeat.",
    copy: "Tell us what you want to improve, automate, or create. We’ll help turn it into a practical digital solution.",
    label: "Get in touch",
  },
} as const;

/**
 * Hero copy for the System Integration service page.
 */
export const systemIntegration = {
  title: "System Integration",
  description:
    "Connect your CRM, ERP, online store, accounting software, and business apps.",
  heroTitleLines: ["Keep your business", "in sync."],
  support: "Connect your CRM, ERP, and business apps.",
  heroCta: "Let’s build",
  chapters: [
    {
      id: "business-integrations",
      title: "Business Integrations",
      description:
        "Connect the systems used across sales, orders, inventory, accounting, and payments so information moves automatically between them.",
      services: [
        {
          id: "crm-erp-integration",
          title: "CRM & ERP",
          copy: "We connect your CRM and ERP so customer, sales, order, inventory, and financial information stays updated across both systems.",
          items: [
            "Synchronize customers and products",
            "Transfer approved quotations and sales",
            "Update order, invoice, stock, and payment statuses",
          ],
          example:
            "A deal is approved in the CRM. The customer and order details are automatically transferred to the ERP for processing and invoicing.",
        },
        {
          id: "ecommerce-operations-integration",
          title: "E-commerce & Operations",
          copy: "We connect your online store with inventory, order, accounting, and delivery systems so each platform stays up to date.",
          items: [
            "Synchronize products, prices, and stock",
            "Transfer online orders",
            "Update payment, fulfilment, delivery, return, and refund information",
          ],
          example:
            "An online order is transferred to the ERP. Stock, payment, fulfilment, and delivery updates are then synchronized back to the online store.",
        },
        {
          id: "accounting-payment-integration",
          title: "Accounting & Payments",
          copy: "We connect your business platforms with accounting software and payment services so financial information stays accurate and up to date.",
          items: [
            "Transfer invoices and transaction details",
            "Record payment confirmations",
            "Update balances, refunds, and order payment statuses",
          ],
          example:
            "A customer completes an online payment. The order is marked as paid, and the transaction details are transferred to the accounting system.",
        },
      ],
    },
    {
      id: "app-connections",
      title: "App Connections",
      description:
        "Connect websites, communication tools, internal software, and older applications so they can exchange information automatically.",
      services: [
        {
          id: "api-custom-integration",
          title: "Custom Connections",
          copy: "We connect websites, internal software, and specialist business apps that do not already work together.",
          items: [
            "Share information between platforms",
            "Check and format data before it is sent",
            "Control which systems can access information",
            "Connect custom and internal applications",
          ],
          example:
            "A booking is created on the website. The information is sent through an API to the company’s internal scheduling system.",
        },
        {
          id: "communication-integration",
          title: "Communication Tools",
          copy: "We connect business systems with the messaging, email, meeting, and collaboration tools your team uses every day.",
          items: [
            "Connect website forms and live chat",
            "Link email, WhatsApp, and SMS",
            "Connect calendars, Microsoft Teams, and Slack",
            "Save communication in CRM or support systems",
          ],
          example:
            "A customer sends a WhatsApp message. The conversation and contact details appear in the CRM, and the employee’s reply is saved with the same customer record.",
        },
        {
          id: "data-migration-synchronization",
          title: "Data Transfer & Sync",
          copy: "We move existing information into new apps and keep important records updated across connected systems.",
          items: [
            "Import customers, products, orders, and historical records",
            "Remove duplicates",
            "Map data fields",
            "Keep selected information updated across platforms",
          ],
          example:
            "Information from older software is cleaned and moved into a new system. Selected customer and product records then remain synchronized across the connected apps.",
        },
      ],
    },
    {
      id: "integration-support",
      title: "Integration Support",
      description:
        "Keep business connections working, resolve transfer problems, and update integrations when software changes.",
      services: [
        {
          id: "integration-monitoring-alerts",
          title: "Monitoring & Alerts",
          copy: "We monitor connected systems and data transfers so failures and delays can be found before they interrupt business work.",
          items: [
            "Check connection and transfer status",
            "Detect failed, delayed, or incomplete transfers",
            "Alert the responsible team",
            "Keep records for investigation",
          ],
          example:
            "Orders stop reaching the ERP. Monitoring identifies the problem, records the affected orders, and alerts the responsible team immediately.",
        },
        {
          id: "integration-error-recovery",
          title: "Error Recovery",
          copy: "We create controlled ways to retry failed transfers, correct incomplete information, and prevent duplicate records.",
          items: [
            "Retry failed transfers safely",
            "Prevent duplicate records",
            "Compare information across connected systems",
            "Send unresolved cases for employee review",
          ],
          example:
            "An order cannot be transferred because one system is temporarily unavailable. It is held safely, retried when the connection returns, and checked to prevent a duplicate order.",
        },
        {
          id: "integration-updates-support",
          title: "Updates & Support",
          copy: "We maintain integrations when apps, access details, data fields, or business processes change.",
          items: [
            "Update connections when platforms change",
            "Renew and manage access details",
            "Test changes before release",
            "Provide ongoing support and improvements",
          ],
          example:
            "An accounting platform changes how other systems connect to it. The integration is updated and tested before the previous connection stops working.",
        },
      ],
    },
  ],
  cta: {
    title: "Let’s build\nwhat your business\nneeds next.",
    label: "Get in touch",
  },
} as const;

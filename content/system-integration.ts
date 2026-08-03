/**
 * Hero copy for the System Integration service page.
 */
export const systemIntegration = {
  title: "System Integration",
  description: "Bring your software, data, and operations together.",
  heroTitleLines: ["Keep your business", "in sync."],
  support: "Bring your software, data, and operations together.",
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
          title: "CRM & ERP Integration",
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
          title: "E-commerce & Operations Integration",
          copy: "We connect your online store with the systems used to manage products, inventory, orders, customers, accounting, and delivery.",
          items: [
            "Synchronize products, prices, and stock",
            "Transfer online orders",
            "Update payment, fulfilment, delivery, return, and refund information",
          ],
          example:
            "A customer places an online order. The stock is updated, the warehouse receives the order, and the customer information is added to the CRM.",
        },
        {
          id: "accounting-payment-integration",
          title: "Accounting & Payment Integration",
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
      id: "data-connectivity",
      title: "Data & Connectivity",
      description:
        "Connect applications and business data so information can move securely and consistently between platforms.",
      services: [
        {
          id: "api-custom-integration",
          title: "API & Custom Integration",
          copy: "We build custom connections between applications that do not already communicate with each other.",
          items: [
            "Transfer information between platforms",
            "Validate and transform data",
            "Manage access permissions",
            "Monitor failed or incomplete transfers",
          ],
          example:
            "A booking is created on the website. The information is sent through an API to the company’s internal scheduling system.",
        },
        {
          id: "communication-integration",
          title: "Communication Integration",
          copy: "We connect business systems with the communication channels your team uses every day.",
          items: [
            "Connect website forms, email, WhatsApp, SMS, live chat, calendars, Microsoft Teams, and Slack with CRM or support platforms",
          ],
          example:
            "A customer submits a website enquiry. The request is saved in the CRM, and the responsible employee receives a notification.",
        },
        {
          id: "data-migration-synchronization",
          title: "Data Migration & Synchronization",
          copy: "We move, clean, and synchronize information between spreadsheets, older software, and new business systems.",
          items: [
            "Import customers, products, orders, and historical records",
            "Remove duplicates",
            "Map data fields",
            "Keep selected information updated across platforms",
          ],
          example:
            "Customer information from several spreadsheets is cleaned, combined, and transferred into a new CRM without duplicate records.",
        },
      ],
    },
  ],
  cta: {
    title: "Let’s build\nwhat your business\nneeds next.",
    label: "Get in touch",
  },
} as const;

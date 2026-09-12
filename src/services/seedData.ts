import { Company, Customer, Invoice, InvoiceSettings, PaymentSettings, Service } from '../types/invoice'
import { amountToWords } from './currency'

export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 64" fill="none"><rect width="48" height="48" y="8" rx="12" fill="%230284C7"/><path d="M18 25L27 32L18 39" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 39H36" stroke="white" stroke-width="3.5" stroke-linecap="round"/><text x="60" y="38" fill="%230F172A" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-weight="800" font-size="25" letter-spacing="-0.5">CODENEST</text><text x="61" y="50" fill="%230284C7" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-weight="600" font-size="9" letter-spacing="1.5">SOFTWARE &amp; APPS</text></svg>`

export const DEFAULT_COMPANY: Company = {
  name: 'Codenest',
  tagline: 'Software • Web • App Development',
  logoUrl: DEFAULT_LOGO_SVG,
  address: 'Level 5, Suite 502, BDBL Bhaban, 12 Kazi Nazrul Islam Avenue, Karwan Bazar',
  city: 'Dhaka 1215',
  country: 'Bangladesh',
  phone: '+880 1711-000000',
  email: 'billing@codenest.dev',
  website: 'https://codenest.dev',
  businessRegNo: 'TRAD/DSCC/024892/2024',
  tin: '459021884102',
  binVat: '003892184-0102',
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  bankName: 'The City Bank PLC',
  accountName: 'Codenest Technologies Ltd.',
  accountNumber: '1502938475001',
  branch: 'Dhanmondi Branch, Dhaka',
  routingNumber: '225261389',
  bkashNumber: '+880 1711-000000 (Merchant)',
  nagadNumber: '+880 1711-000000 (Merchant)',
  additionalInstructions: 'Please state invoice number as reference. Send deposit slips to billing@codenest.dev',
}

export const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  defaultCurrency: 'BDT',
  taxEnabled: true,
  defaultTaxLabel: 'VAT',
  defaultTaxRate: 5,
  defaultPaymentTerms: 'Due within 7 days from invoice date',
  defaultNotes: 'Thank you for choosing Codenest. We appreciate your business and trust in our digital craftsmanship.',
  defaultTerms: `1. Payment is due within 7 days of invoice issuance.
2. Deliverables are governed by project scope agreements and milestones.
3. Final source code and administrative credentials are transferred upon full settlement.
4. Late payments may attract a standard service charge of 1.5% per billing cycle.`,
  defaultTemplate: 'codenest-modern',
  invoicePrefix: 'INV',
  nextInvoiceNumber: 4,
  yearFormat: 'YYYY',
  primaryColor: '#0284c7',
  documentTitle: 'TAX INVOICE',
}

export const SEED_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Website Development',
    description: 'Corporate responsive web portal with Next.js, custom CMS integration, and SEO optimization.',
    defaultPrice: 80000,
    defaultTax: 5,
    unit: 'project',
  },
  {
    id: 'srv-2',
    name: 'Web Application Development',
    description: 'Custom full-stack web application with React, Node.js API, PostgreSQL database & cloud infrastructure.',
    defaultPrice: 150000,
    defaultTax: 5,
    unit: 'project',
  },
  {
    id: 'srv-3',
    name: 'Android / Mobile App Development',
    description: 'Native Android & cross-platform Flutter mobile application with push notifications & offline sync.',
    defaultPrice: 180000,
    defaultTax: 5,
    unit: 'project',
  },
  {
    id: 'srv-4',
    name: 'UI/UX Design',
    description: 'Comprehensive design sprint, user journey mapping, high-fidelity Figma components & interactive prototype.',
    defaultPrice: 35000,
    defaultTax: 5,
    unit: 'project',
  },
  {
    id: 'srv-5',
    name: 'Custom Software Solutions',
    description: 'Enterprise ERP modules, inventory management and automated workflow engine.',
    defaultPrice: 220000,
    defaultTax: 5,
    unit: 'project',
  },
  {
    id: 'srv-6',
    name: 'Maintenance & Support',
    description: 'Monthly 24/7 uptime monitoring, server security hardening, regular patch deployments and priority support.',
    defaultPrice: 15000,
    defaultTax: 5,
    unit: 'month',
  },
  {
    id: 'srv-7',
    name: 'Hosting & Deployment',
    description: 'Production cloud infrastructure orchestration with Docker, Kubernetes, SSL and automated CI/CD pipeline.',
    defaultPrice: 25000,
    defaultTax: 5,
    unit: 'project',
  },
  {
    id: 'srv-8',
    name: 'Consultation & Architecture',
    description: 'Technical architecture review, code audit, scalability roadmap and database optimization.',
    defaultPrice: 20000,
    defaultTax: 5,
    unit: 'project',
  },
]

export const SEED_CUSTOMERS: Customer[] = []

export const SEED_INVOICES: Invoice[] = []

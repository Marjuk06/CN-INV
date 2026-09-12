export type CurrencyCode = 'BDT' | 'USD' | 'EUR' | 'GBP'

export type InvoiceStatus =
  | 'Draft'
  | 'Sent'
  | 'Pending'
  | 'Paid'
  | 'Partially Paid'
  | 'Overdue'
  | 'Cancelled'

export type InvoiceTemplateId =
  | 'codenest-modern'
  | 'codenest-classic'
  | 'codenest-minimal'
  | 'codenest-corporate'
  | 'codenest-dark-accent'

export interface Company {
  name: string
  tagline: string
  logoUrl?: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  website: string
  businessRegNo?: string
  tin?: string
  binVat?: string
  primaryColor?: string
  documentTitle?: string
}

export interface Customer {
  id: string
  name: string
  companyName?: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  taxId?: string
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  defaultPrice: number
  defaultTax: number
  unit: 'project' | 'hour' | 'month' | 'fixed' | 'page'
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
  taxPercentage: number
  amount: number
}

export interface PaymentRecord {
  id: string
  amount: number
  date: string
  method: 'Bank Transfer' | 'bKash' | 'Nagad' | 'Cash' | 'Card' | 'Other'
  transactionId?: string
  notes?: string
}

export interface PaymentSettings {
  bankName: string
  accountName: string
  accountNumber: string
  branch: string
  routingNumber: string
  bkashNumber: string
  nagadNumber: string
  additionalInstructions?: string
}

export interface InvoiceSettings {
  defaultCurrency: CurrencyCode
  taxEnabled: boolean
  defaultTaxLabel: string
  defaultTaxRate: number
  defaultPaymentTerms: string
  defaultNotes: string
  defaultTerms: string
  defaultTemplate: InvoiceTemplateId
  invoicePrefix: string
  nextInvoiceNumber: number
  yearFormat: 'YYYY' | 'YY'
  primaryColor: string
  documentTitle: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  paymentTerms: string
  currency: CurrencyCode
  status: InvoiceStatus
  templateId: InvoiceTemplateId
  
  // Snapshots for immutability & audit integrity
  companySnapshot: Company
  customerSnapshot: Customer
  paymentSnapshot: PaymentSettings
  
  items: InvoiceItem[]
  
  subtotal: number
  discountTotal: number
  taxTotal: number
  taxLabel: string
  grandTotal: number
  amountInWords: string
  
  payments: PaymentRecord[]
  paidAmount: number
  remainingBalance: number
  
  notes: string
  terms: string
  authorizedBy: string
  designation: string
  signatureUrl?: string
  
  createdAt: string
  updatedAt: string
}

export interface AppDataBackup {
  version: string
  exportedAt: string
  company: Company
  settings: InvoiceSettings
  paymentSettings: PaymentSettings
  customers: Customer[]
  services: Service[]
  invoices: Invoice[]
}

import { AppDataBackup, Company, Customer, Invoice, InvoiceSettings, PaymentSettings, Service } from '../types/invoice'
import {
  DEFAULT_COMPANY,
  DEFAULT_INVOICE_SETTINGS,
  DEFAULT_PAYMENT_SETTINGS,
  SEED_CUSTOMERS,
  SEED_INVOICES,
  SEED_SERVICES,
} from './seedData'

const STORAGE_KEYS = {
  INVOICES: 'codenest_invoices_v2',
  CUSTOMERS: 'codenest_customers_v2',
  SERVICES: 'codenest_services_v2',
  COMPANY: 'codenest_company_v2',
  SETTINGS: 'codenest_settings_v2',
  PAYMENT_SETTINGS: 'codenest_payment_settings_v2',
}

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    if (!item) return fallback
    return JSON.parse(item) as T
  } catch (err) {
    console.warn(`Error reading from localStorage [${key}]:`, err)
    return fallback
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`Error writing to localStorage [${key}]:`, err)
  }
}

export const storageService = {
  getCompany(): Company {
    return getItem<Company>(STORAGE_KEYS.COMPANY, DEFAULT_COMPANY)
  },

  saveCompany(company: Company): void {
    setItem(STORAGE_KEYS.COMPANY, company)
  },

  getPaymentSettings(): PaymentSettings {
    return getItem<PaymentSettings>(STORAGE_KEYS.PAYMENT_SETTINGS, DEFAULT_PAYMENT_SETTINGS)
  },

  savePaymentSettings(settings: PaymentSettings): void {
    setItem(STORAGE_KEYS.PAYMENT_SETTINGS, settings)
  },

  getInvoiceSettings(): InvoiceSettings {
    return getItem<InvoiceSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_INVOICE_SETTINGS)
  },

  saveInvoiceSettings(settings: InvoiceSettings): void {
    setItem(STORAGE_KEYS.SETTINGS, settings)
  },

  getCustomers(): Customer[] {
    return getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS)
  },

  saveCustomers(customers: Customer[]): void {
    setItem(STORAGE_KEYS.CUSTOMERS, customers)
  },

  getServices(): Service[] {
    return getItem<Service[]>(STORAGE_KEYS.SERVICES, SEED_SERVICES)
  },

  saveServices(services: Service[]): void {
    setItem(STORAGE_KEYS.SERVICES, services)
  },

  getInvoices(): Invoice[] {
    return getItem<Invoice[]>(STORAGE_KEYS.INVOICES, SEED_INVOICES)
  },

  saveInvoices(invoices: Invoice[]): void {
    setItem(STORAGE_KEYS.INVOICES, invoices)
  },

  exportBackup(): AppDataBackup {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      company: this.getCompany(),
      settings: this.getInvoiceSettings(),
      paymentSettings: this.getPaymentSettings(),
      customers: this.getCustomers(),
      services: this.getServices(),
      invoices: this.getInvoices(),
    }
  },

  importBackup(backup: AppDataBackup): boolean {
    if (!backup || !backup.company || !Array.isArray(backup.invoices)) {
      throw new Error('Invalid backup file format.')
    }

    if (backup.company) this.saveCompany(backup.company)
    if (backup.settings) this.saveInvoiceSettings(backup.settings)
    if (backup.paymentSettings) this.savePaymentSettings(backup.paymentSettings)
    if (Array.isArray(backup.customers)) this.saveCustomers(backup.customers)
    if (Array.isArray(backup.services)) this.saveServices(backup.services)
    if (Array.isArray(backup.invoices)) this.saveInvoices(backup.invoices)

    return true
  },

  resetToDemoData(): void {
    this.saveCompany(DEFAULT_COMPANY)
    this.saveInvoiceSettings(DEFAULT_INVOICE_SETTINGS)
    this.savePaymentSettings(DEFAULT_PAYMENT_SETTINGS)
    this.saveCustomers([])
    this.saveServices(SEED_SERVICES)
    this.saveInvoices([])
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.INVOICES)
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS)
    localStorage.removeItem(STORAGE_KEYS.SERVICES)
    localStorage.removeItem(STORAGE_KEYS.COMPANY)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    localStorage.removeItem(STORAGE_KEYS.PAYMENT_SETTINGS)
  },
}

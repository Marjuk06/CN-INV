import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import {
  AppDataBackup,
  Company,
  Customer,
  Invoice,
  InvoiceItem,
  InvoiceSettings,
  PaymentRecord,
  PaymentSettings,
  Service,
} from '../types/invoice'
import { storageService } from '../services/storage'
import { amountToWords } from '../services/currency'
import { useToast } from './ToastContext'

interface InvoiceContextType {
  invoices: Invoice[]
  customers: Customer[]
  services: Service[]
  company: Company
  settings: InvoiceSettings
  paymentSettings: PaymentSettings
  activeInvoice: Invoice | null
  setActiveInvoice: (invoice: Invoice | null) => void
  createInvoice: (initialCustomer?: Customer) => Invoice
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  duplicateInvoice: (id: string) => Invoice
  recordPayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => void
  deletePayment: (invoiceId: string, paymentId: string) => void
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  addService: (service: Omit<Service, 'id'>) => Service
  updateService: (id: string, updates: Partial<Service>) => void
  deleteService: (id: string) => void
  updateCompany: (updates: Partial<Company>) => void
  updateSettings: (updates: Partial<InvoiceSettings>) => void
  updatePaymentSettings: (updates: Partial<PaymentSettings>) => void
  getNextInvoiceNumber: () => string
  resetDemoData: () => void
  clearAllData: () => void
  importBackupData: (data: AppDataBackup) => boolean
  calculateItemAmount: (item: Partial<InvoiceItem>) => number
  calculateTotals: (items: InvoiceItem[], taxRate: number, taxEnabled: boolean) => {
    subtotal: number
    discountTotal: number
    taxTotal: number
    grandTotal: number
  }
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, error, info } = useToast()

  const [invoices, setInvoices] = useState<Invoice[]>(() => storageService.getInvoices())
  const [customers, setCustomers] = useState<Customer[]>(() => storageService.getCustomers())
  const [services, setServices] = useState<Service[]>(() => storageService.getServices())
  const [company, setCompany] = useState<Company>(() => storageService.getCompany())
  const [settings, setSettings] = useState<InvoiceSettings>(() => storageService.getInvoiceSettings())
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => storageService.getPaymentSettings())
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null)

  // Synchronize state changes to localStorage
  useEffect(() => {
    storageService.saveInvoices(invoices)
  }, [invoices])

  useEffect(() => {
    storageService.saveCustomers(customers)
  }, [customers])

  useEffect(() => {
    storageService.saveServices(services)
  }, [services])

  useEffect(() => {
    storageService.saveCompany(company)
  }, [company])

  useEffect(() => {
    storageService.saveInvoiceSettings(settings)
  }, [settings])

  useEffect(() => {
    storageService.savePaymentSettings(paymentSettings)
  }, [paymentSettings])

  useEffect(() => {
    if (!settings.primaryColor) return

    const hex = settings.primaryColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const hoverR = Math.max(0, r - 30)
    const hoverG = Math.max(0, g - 30)
    const hoverB = Math.max(0, b - 30)

    const root = document.documentElement
    root.style.setProperty('--brand-primary', settings.primaryColor)
    root.style.setProperty('--brand-primary-hover', `rgb(${hoverR}, ${hoverG}, ${hoverB})`)
    root.style.setProperty('--brand-primary-light', `rgba(${r}, ${g}, ${b}, 0.1)`)
    root.style.setProperty('--brand-primary-glow', `rgba(${r}, ${g}, ${b}, 0.25)`)
  }, [settings.primaryColor])

  const getNextInvoiceNumber = useCallback((): string => {
    const prefix = settings.invoicePrefix || 'INV'
    const now = new Date()
    const year = settings.yearFormat === 'YY' ? String(now.getFullYear()).slice(-2) : String(now.getFullYear())
    const seq = String(settings.nextInvoiceNumber).padStart(3, '0')
    return `${prefix}-${year}-${seq}`
  }, [settings])

  const calculateItemAmount = useCallback((item: Partial<InvoiceItem>): number => {
    const qty = Number(item.quantity) || 0
    const price = Number(item.unitPrice) || 0
    const base = qty * price

    let discount = 0
    if (item.discountType === 'percentage') {
      discount = (base * (Number(item.discountValue) || 0)) / 100
    } else {
      discount = Number(item.discountValue) || 0
    }

    const discounted = Math.max(0, base - discount)
    return discounted
  }, [])

  const calculateTotals = useCallback(
    (items: InvoiceItem[], taxRate: number, taxEnabled: boolean) => {
      let subtotal = 0
      let discountTotal = 0

      items.forEach((item) => {
        const qty = Number(item.quantity) || 0
        const price = Number(item.unitPrice) || 0
        const itemGross = qty * price
        subtotal += itemGross

        if (item.discountType === 'percentage') {
          discountTotal += (itemGross * (Number(item.discountValue) || 0)) / 100
        } else {
          discountTotal += Number(item.discountValue) || 0
        }
      })

      const taxableBase = Math.max(0, subtotal - discountTotal)
      const effectiveTax = taxEnabled ? (taxableBase * (Number(taxRate) || 0)) / 100 : 0
      const grandTotal = Math.round((taxableBase + effectiveTax) * 100) / 100

      return {
        subtotal,
        discountTotal,
        taxTotal: effectiveTax,
        grandTotal,
      }
    },
    []
  )

  const createInvoice = useCallback(
    (initialCustomer?: Customer): Invoice => {
      const invNumber = getNextInvoiceNumber()
      const today = new Date().toISOString().split('T')[0]
      const dueDateObj = new Date()
      dueDateObj.setDate(dueDateObj.getDate() + 7)
      const dueDate = dueDateObj.toISOString().split('T')[0]

      // Default customer fallback if not passed
      const targetCustomer =
        initialCustomer ||
        customers[0] || {
          id: 'cust-temp',
          name: 'Walk-in Client',
          companyName: '',
          email: '',
          phone: '',
          address: '',
          city: 'Dhaka',
          country: 'Bangladesh',
          createdAt: today,
        }

      const defaultItem: InvoiceItem = {
        id: `item-${Date.now()}`,
        description: 'Software Development & Technical Consulting',
        quantity: 1,
        unitPrice: 50000,
        discountType: 'percentage',
        discountValue: 0,
        taxPercentage: settings.taxEnabled ? settings.defaultTaxRate : 0,
        amount: 50000,
      }

      const totals = calculateTotals([defaultItem], settings.defaultTaxRate, settings.taxEnabled)

      // CRITICAL ARCHITECTURAL RULE: Immutable snapshots taken right at creation
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invNumber,
        date: today,
        dueDate: dueDate,
        paymentTerms: settings.defaultPaymentTerms,
        currency: settings.defaultCurrency,
        status: 'Draft',
        templateId: settings.defaultTemplate,
        companySnapshot: { ...company },
        customerSnapshot: { ...targetCustomer },
        paymentSnapshot: { ...paymentSettings },
        items: [defaultItem],
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        taxLabel: `${settings.defaultTaxLabel} (${settings.defaultTaxRate}%)`,
        grandTotal: totals.grandTotal,
        amountInWords: amountToWords(totals.grandTotal, settings.defaultCurrency),
        payments: [],
        paidAmount: 0,
        remainingBalance: totals.grandTotal,
        notes: settings.defaultNotes,
        terms: settings.defaultTerms,
        authorizedBy: 'Syed Marjuk',
        designation: 'Managing Director & Lead Architect',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setInvoices((prev) => [newInvoice, ...prev])
      setSettings((prev) => ({ ...prev, nextInvoiceNumber: prev.nextInvoiceNumber + 1 }))
      setActiveInvoice(newInvoice)
      success(`Invoice ${invNumber} created as Draft.`)
      return newInvoice
    },
    [
      getNextInvoiceNumber,
      customers,
      settings,
      calculateTotals,
      company,
      paymentSettings,
      success,
    ]
  )

  const updateInvoice = useCallback(
    (id: string, updates: Partial<Invoice>) => {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== id) return inv

          const merged: Invoice = { ...inv, ...updates, updatedAt: new Date().toISOString() }

          // Auto-recalculate items & amounts if items, taxRate, or currency changed
          if (updates.items || updates.currency !== undefined) {
            let subtotal = 0
            let discountTotal = 0

            const refreshedItems = (merged.items || []).map((it) => {
              const qty = Number(it.quantity) || 0
              const price = Number(it.unitPrice) || 0
              const base = qty * price
              let disc = 0
              if (it.discountType === 'percentage') {
                disc = (base * (Number(it.discountValue) || 0)) / 100
              } else {
                disc = Number(it.discountValue) || 0
              }
              subtotal += base
              discountTotal += disc
              return {
                ...it,
                amount: Math.max(0, base - disc),
              }
            })

            merged.items = refreshedItems
            merged.subtotal = subtotal
            merged.discountTotal = discountTotal

            const taxable = Math.max(0, subtotal - discountTotal)
            const taxPercentage = settings.taxEnabled ? settings.defaultTaxRate : 0
            merged.taxTotal = (taxable * taxPercentage) / 100
            merged.grandTotal = Math.round((taxable + merged.taxTotal) * 100) / 100
            merged.amountInWords = amountToWords(merged.grandTotal, merged.currency)

            // Recalculate remaining balance
            const paid = merged.payments?.reduce((acc, p) => acc + (Number(p.amount) || 0), 0) || 0
            merged.paidAmount = paid
            merged.remainingBalance = Math.max(0, merged.grandTotal - paid)

            // Dynamic status adjustment if not explicitly modified
            if (!updates.status) {
              if (paid >= merged.grandTotal && merged.grandTotal > 0) {
                merged.status = 'Paid'
              } else if (paid > 0 && paid < merged.grandTotal) {
                merged.status = 'Partially Paid'
              }
            }
          }

          if (activeInvoice?.id === id) {
            setActiveInvoice(merged)
          }

          return merged
        })
      )
    },
    [activeInvoice, settings]
  )

  const deleteInvoice = useCallback(
    (id: string) => {
      const invToDelete = invoices.find((i) => i.id === id)
      setInvoices((prev) => prev.filter((i) => i.id !== id))
      if (activeInvoice?.id === id) {
        setActiveInvoice(null)
      }
      info(`Invoice ${invToDelete?.invoiceNumber || id} deleted.`)
    },
    [activeInvoice, invoices, info]
  )

  const duplicateInvoice = useCallback(
    (id: string): Invoice => {
      const source = invoices.find((i) => i.id === id)
      if (!source) throw new Error('Invoice not found')

      const newInvNumber = getNextInvoiceNumber()
      const today = new Date().toISOString().split('T')[0]
      const dueDateObj = new Date()
      dueDateObj.setDate(dueDateObj.getDate() + 7)

      const duplicated: Invoice = {
        ...source,
        id: `inv-${Date.now()}`,
        invoiceNumber: newInvNumber,
        date: today,
        dueDate: dueDateObj.toISOString().split('T')[0],
        status: 'Draft',
        payments: [],
        paidAmount: 0,
        remainingBalance: source.grandTotal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setInvoices((prev) => [duplicated, ...prev])
      setSettings((prev) => ({ ...prev, nextInvoiceNumber: prev.nextInvoiceNumber + 1 }))
      setActiveInvoice(duplicated)
      success(`Duplicated as ${newInvNumber}.`)
      return duplicated
    },
    [invoices, getNextInvoiceNumber, success]
  )

  const recordPayment = useCallback(
    (invoiceId: string, paymentData: Omit<PaymentRecord, 'id'>) => {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== invoiceId) return inv

          const newPayment: PaymentRecord = {
            id: `pay-${Date.now()}`,
            ...paymentData,
          }

          const payments = [...(inv.payments || []), newPayment]
          const paidAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
          const remainingBalance = Math.max(0, inv.grandTotal - paidAmount)

          let status = inv.status
          if (remainingBalance <= 0) {
            status = 'Paid'
          } else if (paidAmount > 0) {
            status = 'Partially Paid'
          }

          const updated: Invoice = {
            ...inv,
            payments,
            paidAmount,
            remainingBalance,
            status,
            updatedAt: new Date().toISOString(),
          }

          if (activeInvoice?.id === invoiceId) {
            setActiveInvoice(updated)
          }

          return updated
        })
      )
      success('Payment recorded successfully.')
    },
    [activeInvoice, success]
  )

  const deletePayment = useCallback(
    (invoiceId: string, paymentId: string) => {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== invoiceId) return inv

          const payments = (inv.payments || []).filter((p) => p.id !== paymentId)
          const paidAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
          const remainingBalance = Math.max(0, inv.grandTotal - paidAmount)

          let status = inv.status
          if (remainingBalance <= 0 && inv.grandTotal > 0) {
            status = 'Paid'
          } else if (paidAmount > 0) {
            status = 'Partially Paid'
          } else if (inv.status === 'Paid' || inv.status === 'Partially Paid') {
            status = 'Pending'
          }

          const updated: Invoice = {
            ...inv,
            payments,
            paidAmount,
            remainingBalance,
            status,
            updatedAt: new Date().toISOString(),
          }

          if (activeInvoice?.id === invoiceId) {
            setActiveInvoice(updated)
          }

          return updated
        })
      )
      info('Payment record removed.')
    },
    [activeInvoice, info]
  )

  const addCustomer = useCallback(
    (custData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        ...custData,
        createdAt: new Date().toISOString(),
      }
      setCustomers((prev) => [newCust, ...prev])
      success(`Customer ${newCust.name} added.`)
      return newCust
    },
    [success]
  )

  const updateCustomer = useCallback(
    (id: string, updates: Partial<Customer>) => {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
      success('Customer profile updated.')
    },
    [success]
  )

  const deleteCustomer = useCallback(
    (id: string) => {
      setCustomers((prev) => prev.filter((c) => c.id !== id))
      info('Customer removed.')
    },
    [info]
  )

  const addService = useCallback(
    (srvData: Omit<Service, 'id'>): Service => {
      const newService: Service = {
        id: `srv-${Date.now()}`,
        ...srvData,
      }
      setServices((prev) => [...prev, newService])
      success(`Service ${newService.name} added.`)
      return newService
    },
    [success]
  )

  const updateService = useCallback(
    (id: string, updates: Partial<Service>) => {
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
      success('Service updated.')
    },
    [success]
  )

  const deleteService = useCallback(
    (id: string) => {
      setServices((prev) => prev.filter((s) => s.id !== id))
      info('Service removed.')
    },
    [info]
  )

  const updateCompany = useCallback(
    (updates: Partial<Company>) => {
      setCompany((prev) => ({ ...prev, ...updates }))
      success('Company profile updated.')
    },
    [success]
  )

  const updateSettings = useCallback(
    (updates: Partial<InvoiceSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }))
      success('Invoice preferences saved.')
    },
    [success]
  )

  const updatePaymentSettings = useCallback(
    (updates: Partial<PaymentSettings>) => {
      setPaymentSettings((prev) => ({ ...prev, ...updates }))
      success('Payment instructions updated.')
    },
    [success]
  )

  const resetDemoData = useCallback(() => {
    storageService.resetToDemoData()
    setCompany(storageService.getCompany())
    setSettings(storageService.getInvoiceSettings())
    setPaymentSettings(storageService.getPaymentSettings())
    setCustomers(storageService.getCustomers())
    setServices(storageService.getServices())
    setInvoices(storageService.getInvoices())
    setActiveInvoice(null)
    success('Application reset to Codenest demo data.')
  }, [success])

  const clearAllData = useCallback(() => {
    storageService.clearAllData()
    setCompany(storageService.getCompany())
    setSettings(storageService.getInvoiceSettings())
    setPaymentSettings(storageService.getPaymentSettings())
    setCustomers(storageService.getCustomers())
    setServices(storageService.getServices())
    setInvoices(storageService.getInvoices())
    setActiveInvoice(null)
    success('All data cleared successfully.')
  }, [success])

  const importBackupData = useCallback(
    (backup: AppDataBackup): boolean => {
      try {
        storageService.importBackup(backup)
        setCompany(storageService.getCompany())
        setSettings(storageService.getInvoiceSettings())
        setPaymentSettings(storageService.getPaymentSettings())
        setCustomers(storageService.getCustomers())
        setServices(storageService.getServices())
        setInvoices(storageService.getInvoices())
        setActiveInvoice(null)
        success('Data backup restored successfully!')
        return true
      } catch (err: unknown) {
        error(err instanceof Error ? err.message : 'Failed to import backup file.')
        return false
      }
    },
    [success, error]
  )

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        customers,
        services,
        company,
        settings,
        paymentSettings,
        activeInvoice,
        setActiveInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        duplicateInvoice,
        recordPayment,
        deletePayment,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addService,
        updateService,
        deleteService,
        updateCompany,
        updateSettings,
        updatePaymentSettings,
        getNextInvoiceNumber,
        resetDemoData,
        clearAllData,
        importBackupData,
        calculateItemAmount,
        calculateTotals,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}

export const useInvoice = () => {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider')
  }
  return context
}

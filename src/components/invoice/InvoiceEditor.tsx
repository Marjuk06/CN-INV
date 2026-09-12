import React, { useState } from 'react'
import {
  CurrencyCode,
  Customer,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  InvoiceTemplateId,
  PaymentRecord,
} from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { useToast } from '../../context/ToastContext'
import { InvoiceItemRow } from './InvoiceItemRow'
import { InvoicePreview } from './InvoicePreview'
import { ShareModal } from './ShareModal'
import { PaymentRecordModal } from './PaymentRecordModal'
import { generateInvoicePDF } from '../../services/pdfGenerator'
import { printInvoice } from '../../services/printService'
import { formatCurrency } from '../../services/currency'
import {
  ArrowLeft,
  Save,
  Download,
  Printer,
  Share2,
  Plus,
  CreditCard,
  Building2,
  FileText,
  DollarSign,
  UserPlus,
  Upload,
  Eye,
  Edit3,
} from 'lucide-react'

interface InvoiceEditorProps {
  invoice: Invoice
  onBack: () => void
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ invoice, onBack }) => {
  const {
    updateInvoice,
    company,
    paymentSettings,
    customers,
    services,
    addCustomer,
    recordPayment,
    deletePayment,
  } = useInvoice()
  const { success, error } = useToast()

  // Mobile tab state: 'edit' or 'preview'
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false)
  const [isExportingPDF, setIsExportingPDF] = useState(false)

  // Quick Customer Form State
  const [quickCustName, setQuickCustName] = useState('')
  const [quickCustCompany, setQuickCustCompany] = useState('')
  const [quickCustEmail, setQuickCustEmail] = useState('')
  const [quickCustPhone, setQuickCustPhone] = useState('')
  const [quickCustAddress, setQuickCustAddress] = useState('')
  const [quickCustCity, setQuickCustCity] = useState('Dhaka')

  const handleUpdate = (updates: Partial<Invoice>) => {
    updateInvoice(invoice.id, updates)
  }

  const handleItemChange = (index: number, updatedItem: InvoiceItem) => {
    const newItems = [...invoice.items]
    newItems[index] = updatedItem
    handleUpdate({ items: newItems })
  }

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      discountType: 'percentage',
      discountValue: 0,
      taxPercentage: 5,
      amount: 0,
    }
    handleUpdate({ items: [...invoice.items, newItem] })
  }

  const handleRemoveItem = (index: number) => {
    if (invoice.items.length <= 1) {
      error('An invoice must contain at least one item.')
      return
    }
    const newItems = invoice.items.filter((_, i) => i !== index)
    handleUpdate({ items: newItems })
  }

  const handleCustomerSelect = (customerId: string) => {
    const selected = customers.find((c) => c.id === customerId)
    if (selected) {
      handleUpdate({ customerSnapshot: { ...selected } })
    }
  }

  const handleQuickAddCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickCustName.trim()) return

    const newCust = addCustomer({
      name: quickCustName.trim(),
      companyName: quickCustCompany.trim() || undefined,
      email: quickCustEmail.trim(),
      phone: quickCustPhone.trim(),
      address: quickCustAddress.trim(),
      city: quickCustCity.trim(),
      country: 'Bangladesh',
    })

    handleUpdate({ customerSnapshot: { ...newCust } })
    setIsNewCustomerModalOpen(false)
    setQuickCustName('')
    setQuickCustCompany('')
    setQuickCustEmail('')
    setQuickCustPhone('')
    setQuickCustAddress('')
  }

  const handleDownloadPDF = () => {
    success('Destination: "Save as PDF" সিলেক্ট করে সেভ করুন।')
    printInvoice({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.customerSnapshot.name,
    })
  }

  const handleSave = () => {
    // Sync company profile and payment settings from the latest global settings
    handleUpdate({
      companySnapshot: { ...company },
      paymentSnapshot: { ...paymentSettings },
    })
    success('Invoice saved successfully!')
    onBack()
  }

  const handlePrint = () => {
    printInvoice({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.customerSnapshot.name,
    })
  }

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      error('Signature file must be under 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      handleUpdate({ signatureUrl: base64 })
      success('Signature image uploaded.')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col h-screen print:!h-auto print:!min-h-0 print:!block print:!p-0 print:!m-0">
      {/* Top action header */}
      <div className="no-print bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Back to Invoices"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {invoice.invoiceNumber}
              </h1>
              <select
                value={invoice.status}
                onChange={(e) => handleUpdate({ status: e.target.value as InvoiceStatus })}
                className="text-xs font-medium py-0.5 px-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-400">
              Customer: {invoice.customerSnapshot.name || 'Unassigned'} •{' '}
              {formatCurrency(invoice.grandTotal, invoice.currency)}
            </p>
          </div>
        </div>

        {/* Mobile segmented toggle */}
        <div className="flex lg:hidden bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setMobileTab('edit')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mobileTab === 'edit'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              mobileTab === 'preview'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaymentOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
            title="Record payment"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Payments</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
            title="Print invoice"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
            title="Share invoice"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            type="button"
            disabled={isExportingPDF}
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm shadow-sky-500/20"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium rounded-lg transition-colors shadow-sm shadow-slate-900/10 ml-2"
            title="Save Invoice"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden print:overflow-visible">
        {/* Left Side: Form Editor */}
        <div
          className={`w-full lg:w-[52%] xl:w-[50%] h-full overflow-y-auto p-4 sm:p-6 space-y-6 print:hidden ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Section 1: Basic Information */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-4 shadow-lg shadow-slate-900/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              Invoice Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={(e) => handleUpdate({ invoiceNumber: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => handleUpdate({ date: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => handleUpdate({ dueDate: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  value={invoice.currency}
                  onChange={(e) => handleUpdate({ currency: e.target.value as CurrencyCode })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-semibold"
                >
                  <option value="BDT">BDT (৳) — Bangladeshi Taka</option>
                  <option value="USD">USD ($) — US Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  placeholder="e.g. Due within 7 days from invoice date"
                  value={invoice.paymentTerms}
                  onChange={(e) => handleUpdate({ paymentTerms: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Customer Selection */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-4 shadow-lg shadow-slate-900/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                Customer / Client Information
              </h3>
              <button
                type="button"
                onClick={() => setIsNewCustomerModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ New Client</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Existing Client
                </label>
                <select
                  value={invoice.customerSnapshot.id || ''}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Choose a customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.companyName ? `(${c.companyName})` : ''} — {c.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Contact Name</label>
                  <input
                    type="text"
                    value={invoice.customerSnapshot.name}
                    onChange={(e) =>
                      handleUpdate({
                        customerSnapshot: { ...invoice.customerSnapshot, name: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Company Name</label>
                  <input
                    type="text"
                    value={invoice.customerSnapshot.companyName || ''}
                    onChange={(e) =>
                      handleUpdate({
                        customerSnapshot: { ...invoice.customerSnapshot, companyName: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Email</label>
                  <input
                    type="email"
                    value={invoice.customerSnapshot.email}
                    onChange={(e) =>
                      handleUpdate({
                        customerSnapshot: { ...invoice.customerSnapshot, email: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Phone</label>
                  <input
                    type="text"
                    value={invoice.customerSnapshot.phone}
                    onChange={(e) =>
                      handleUpdate({
                        customerSnapshot: { ...invoice.customerSnapshot, phone: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-0.5">Billing Address</label>
                  <input
                    type="text"
                    value={invoice.customerSnapshot.address}
                    onChange={(e) =>
                      handleUpdate({
                        customerSnapshot: { ...invoice.customerSnapshot, address: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Line Items */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-4 shadow-lg shadow-slate-900/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-sky-600" />
                Invoice Line Items ({invoice.items.length})
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 text-sky-600 dark:text-sky-400 text-xs font-semibold rounded-lg transition-colors border border-sky-200 dark:border-sky-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {invoice.items.map((item, idx) => (
                <InvoiceItemRow
                  key={item.id || idx}
                  item={item}
                  index={idx}
                  currency={invoice.currency}
                  availableServices={services}
                  onChange={(updated) => handleItemChange(idx, updated)}
                  onRemove={() => handleRemoveItem(idx)}
                />
              ))}
            </div>

            {/* Calculations Summary Box */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount Total</span>
                <span className="font-mono">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-2">
                  <span>Tax Label:</span>
                  <input
                    type="text"
                    value={invoice.taxLabel}
                    onChange={(e) => handleUpdate({ taxLabel: e.target.value })}
                    className="w-24 px-1.5 py-0.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300"
                  />
                </div>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {formatCurrency(invoice.taxTotal, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 text-base">
                  {formatCurrency(invoice.grandTotal, invoice.currency)}
                </span>
              </div>
            </div>

            {/* Live Amount in words */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Amount in Words (Auto-generated)
              </span>
              <p className="italic text-slate-700 dark:text-slate-300 font-medium">
                "{invoice.amountInWords}"
              </p>
            </div>
          </div>

          {/* Section 4: Notes, Terms & Signatory */}
          <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-4 shadow-lg shadow-slate-900/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Notes &amp; Signatory
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Customer Notes
                </label>
                <textarea
                  rows={2}
                  value={invoice.notes}
                  onChange={(e) => handleUpdate({ notes: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Terms &amp; Conditions
                </label>
                <textarea
                  rows={3}
                  value={invoice.terms}
                  onChange={(e) => handleUpdate({ terms: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Authorized Signatory Name
                  </label>
                  <input
                    type="text"
                    value={invoice.authorizedBy}
                    onChange={(e) => handleUpdate({ authorizedBy: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={invoice.designation}
                    onChange={(e) => handleUpdate({ designation: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Signature Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {invoice.signatureUrl && (
                    <img
                      src={invoice.signatureUrl}
                      alt="Signature"
                      className="h-10 border border-slate-200 dark:border-slate-700 rounded p-1 bg-white"
                    />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{invoice.signatureUrl ? 'Change' : 'Upload'} Signature</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                  </label>
                  {invoice.signatureUrl && (
                    <button
                      type="button"
                      onClick={() => handleUpdate({ signatureUrl: undefined })}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Live Preview */}
        <div
          className={`w-full lg:w-[48%] xl:w-[50%] h-full flex flex-col border-l border-slate-200 dark:border-slate-800 print:w-full print:!border-none print:!bg-transparent print:flex print:static print:h-auto print:overflow-visible ${
            mobileTab === 'edit' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <InvoicePreview
            invoice={invoice}
            onTemplateChange={(templateId: InvoiceTemplateId) => handleUpdate({ templateId })}
            showTemplatePicker={true}
          />
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        invoice={invoice}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Payment Record Modal */}
      <PaymentRecordModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        invoice={invoice}
        onAddPayment={(payment) => recordPayment(invoice.id, payment)}
        onDeletePayment={(paymentId) => deletePayment(invoice.id, paymentId)}
      />

      {/* Quick Add Customer Modal */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Add New Customer
            </h3>
            <form onSubmit={handleQuickAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={quickCustName}
                  onChange={(e) => setQuickCustName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  value={quickCustCompany}
                  onChange={(e) => setQuickCustCompany(e.target.value)}
                  placeholder="e.g. ABC Technologies Ltd."
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={quickCustEmail}
                    onChange={(e) => setQuickCustEmail(e.target.value)}
                    placeholder="tanvir@abctech.com"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={quickCustPhone}
                    onChange={(e) => setQuickCustPhone(e.target.value)}
                    placeholder="+880 1819-000000"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={quickCustAddress}
                  onChange={(e) => setQuickCustAddress(e.target.value)}
                  placeholder="e.g. Gulshan-1, Dhaka"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-sm"
                >
                  Save &amp; Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

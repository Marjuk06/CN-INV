import React, { useState } from 'react'
import { Invoice, InvoiceTemplateId } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { useToast } from '../../context/ToastContext'
import { InvoicePreview } from '../invoice/InvoicePreview'
import { Palette, Check, Sparkles } from 'lucide-react'

export const TemplateGallery: React.FC = () => {
  const { invoices, settings, updateSettings } = useInvoice()
  const { success } = useToast()

  // Use an active or first invoice for demonstration
  const previewInvoice: Invoice = invoices[0] || {
    id: 'demo-preview',
    invoiceNumber: 'INV-2026-001',
    date: '2026-02-01',
    dueDate: '2026-02-08',
    paymentTerms: 'Due within 7 days',
    currency: 'BDT',
    status: 'Paid',
    templateId: settings.defaultTemplate,
    companySnapshot: {
      name: 'Codenest',
      tagline: 'Software • Web • App Development',
      address: 'Level 5, Suite 502, BDBL Bhaban, Karwan Bazar',
      city: 'Dhaka 1215',
      country: 'Bangladesh',
      phone: '+880 1711-000000',
      email: 'billing@codenest.dev',
      website: 'https://codenest.dev',
      binVat: '003892184-0102',
    },
    customerSnapshot: {
      id: 'cust-demo',
      name: 'Tanvir Ahmed',
      companyName: 'ABC Technologies Ltd.',
      email: 'tanvir@abctech.com.bd',
      phone: '+880 1819-123456',
      address: 'Plot 14, Block C, Gulshan-1',
      city: 'Dhaka',
      country: 'Bangladesh',
      createdAt: '2026-01-01',
    },
    paymentSnapshot: {
      bankName: 'The City Bank PLC',
      accountName: 'Codenest Technologies Ltd.',
      accountNumber: '1502938475001',
      branch: 'Dhanmondi Branch, Dhaka',
      routingNumber: '225261389',
      bkashNumber: '+880 1711-000000',
      nagadNumber: '+880 1711-000000',
    },
    items: [
      {
        id: '1',
        description: 'Website Development (Corporate Portal)',
        quantity: 1,
        unitPrice: 80000,
        discountType: 'fixed',
        discountValue: 0,
        taxPercentage: 5,
        amount: 80000,
      },
    ],
    subtotal: 80000,
    discountTotal: 0,
    taxTotal: 4000,
    taxLabel: 'VAT (5%)',
    grandTotal: 84000,
    amountInWords: 'Eighty-Four Thousand Taka Only',
    payments: [],
    paidAmount: 84000,
    remainingBalance: 0,
    notes: 'Thank you for choosing Codenest.',
    terms: 'Standard terms apply.',
    authorizedBy: 'Syed Marjuk',
    designation: 'Managing Director & Lead Architect',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  }

  const [activeTemplate, setActiveTemplate] = useState<InvoiceTemplateId>(settings.defaultTemplate)

  const templateOptions: { id: InvoiceTemplateId; name: string; desc: string; tag: string }[] = [
    {
      id: 'codenest-modern',
      name: 'Codenest Modern',
      desc: 'Clean corporate tech design with balanced hierarchy, refined typography and slate accents.',
      tag: 'Default Branded',
    },
    {
      id: 'codenest-classic',
      name: 'Codenest Classic',
      desc: 'Traditional boxed layout with formal tabular borders, suitable for corporate & legal audits.',
      tag: 'Formal Boxed',
    },
    {
      id: 'codenest-minimal',
      name: 'Codenest Minimal',
      desc: 'Swiss typographic style with generous whitespace, hairline borders, and subtle monospace numbers.',
      tag: 'Ultra-Clean',
    },
    {
      id: 'codenest-corporate',
      name: 'Codenest Corporate',
      desc: 'Executive aesthetic featuring a full slate-900 header accent bar and structured billing breakdown.',
      tag: 'Executive',
    },
    {
      id: 'codenest-dark-accent',
      name: 'Codenest Dark Accent',
      desc: 'High-contrast navy/slate header card with clean white line-item table body.',
      tag: 'High Contrast',
    },
  ]

  const handleSetDefault = (tId: InvoiceTemplateId) => {
    updateSettings({ defaultTemplate: tId })
    success(`${templateOptions.find((t) => t.id === tId)?.name} set as default invoice template!`)
  }

  const currentInvoiceWithTheme: Invoice = {
    ...previewInvoice,
    templateId: activeTemplate,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Invoice Templates Gallery
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Choose from 5 distinct professional A4 designs crafted specifically for software companies
        </p>
      </div>

      {/* Template Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {templateOptions.map((t) => {
          const isSelected = activeTemplate === t.id
          const isDefault = settings.defaultTemplate === t.id

          return (
            <div
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-sky-50/60 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600 ring-2 ring-sky-500/20 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {t.tag}
                  </span>
                  {isDefault && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3 h-3" /> Default
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                  {isSelected ? 'Viewing' : 'Click to preview'}
                </span>
                {!isDefault && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetDefault(t.id)
                    }}
                    className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Live Preview Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Live A4 Preview: {templateOptions.find((t) => t.id === activeTemplate)?.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleSetDefault(activeTemplate)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Use as Default Template</span>
          </button>
        </div>

        <div className="h-[750px] overflow-hidden">
          <InvoicePreview
            invoice={currentInvoiceWithTheme}
            onTemplateChange={setActiveTemplate}
            showTemplatePicker={false}
          />
        </div>
      </div>
    </div>
  )
}

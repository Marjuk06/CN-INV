import React, { useState, useEffect } from 'react'
import { PaymentSettings } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { Landmark, Smartphone, Info, Save } from 'lucide-react'

export const PaymentMethods: React.FC = () => {
  const { paymentSettings, updatePaymentSettings } = useInvoice()
  const [localPaymentSettings, setLocalPaymentSettings] = useState<PaymentSettings>(paymentSettings)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setLocalPaymentSettings(paymentSettings)
    setIsDirty(false)
  }, [paymentSettings])

  const handleFieldChange = (field: keyof PaymentSettings, value: string) => {
    setLocalPaymentSettings(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = () => {
    if (isDirty) {
      updatePaymentSettings(localPaymentSettings)
      setIsDirty(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Payment Information &amp; Instructions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure default banking coordinates and mobile financial services (MFS) for invoices
        </p>
      </div>

      {/* Bank Transfer Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-sky-600" />
          Primary Bank Account
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={localPaymentSettings.bankName}
              onChange={(e) => handleFieldChange('bankName', e.target.value)}
              placeholder="e.g. The City Bank PLC"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Account Name
            </label>
            <input
              type="text"
              value={localPaymentSettings.accountName}
              onChange={(e) => handleFieldChange('accountName', e.target.value)}
              placeholder="e.g. Codenest Technologies Ltd."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={localPaymentSettings.accountNumber}
              onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
              placeholder="e.g. 1502938475001"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Branch Name
            </label>
            <input
              type="text"
              value={localPaymentSettings.branch}
              onChange={(e) => handleFieldChange('branch', e.target.value)}
              placeholder="e.g. Dhanmondi Branch, Dhaka"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Routing Number
            </label>
            <input
              type="text"
              value={localPaymentSettings.routingNumber}
              onChange={(e) => handleFieldChange('routingNumber', e.target.value)}
              placeholder="e.g. 225261389"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Mobile Banking Section */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          Mobile Financial Services (MFS)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              bKash Merchant / Personal
            </label>
            <input
              type="text"
              value={localPaymentSettings.bkashNumber}
              onChange={(e) => handleFieldChange('bkashNumber', e.target.value)}
              placeholder="e.g. 01711-000000 (Merchant - Make Payment)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Nagad Merchant / Personal
            </label>
            <input
              type="text"
              value={localPaymentSettings.nagadNumber}
              onChange={(e) => handleFieldChange('nagadNumber', e.target.value)}
              placeholder="e.g. 01711-000000 (Merchant)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Additional Remittance Instructions
            </label>
            <textarea
              rows={2}
              value={localPaymentSettings.additionalInstructions || ''}
              onChange={(e) => handleFieldChange('additionalInstructions', e.target.value)}
              placeholder="e.g. Please state the invoice number as the payment reference..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}


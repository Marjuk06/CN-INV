import React, { useState, useEffect } from 'react'
import { CurrencyCode, InvoiceSettings, InvoiceTemplateId } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { Sliders, Hash, Percent, FileText, Save } from 'lucide-react'

export const InvoiceDefaults: React.FC = () => {
  const { settings, updateSettings } = useInvoice()
  const [localSettings, setLocalSettings] = useState<InvoiceSettings>(settings)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setLocalSettings(settings)
    setIsDirty(false)
  }, [settings])

  const handleFieldChange = (field: keyof InvoiceSettings, value: unknown) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = () => {
    if (isDirty) {
      updateSettings(localSettings)
      setIsDirty(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Invoice Defaults &amp; Preferences
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Pre-populate recurring terms, tax rates, currency, and numbering sequences
        </p>
      </div>

      {/* Numbering Sequence */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <Hash className="w-4 h-4 text-sky-600" />
          Automatic Invoice Numbering
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Prefix
            </label>
            <input
              type="text"
              value={localSettings.invoicePrefix}
              onChange={(e) => handleFieldChange('invoicePrefix', e.target.value.toUpperCase())}
              placeholder="INV"
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Year Format
            </label>
            <select
              value={localSettings.yearFormat}
              onChange={(e) => handleFieldChange('yearFormat', e.target.value as 'YYYY' | 'YY')}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            >
              <option value="YYYY">YYYY (e.g. 2026)</option>
              <option value="YY">YY (e.g. 26)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Next Sequence Number
            </label>
            <input
              type="number"
              min="1"
              value={localSettings.nextInvoiceNumber}
              onChange={(e) => handleFieldChange('nextInvoiceNumber', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-500 pt-1">
          Next generated invoice will be formatted as:{' '}
          <strong className="font-mono text-sky-600 dark:text-sky-400">
            {localSettings.invoicePrefix}-{localSettings.yearFormat === 'YY' ? '26' : '2026'}-
            {String(localSettings.nextInvoiceNumber).padStart(3, '0')}
          </strong>
        </div>
      </div>

      {/* Currency & Tax */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <Percent className="w-4 h-4 text-sky-600" />
          Currency &amp; Taxation
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Currency
            </label>
            <select
              value={localSettings.defaultCurrency}
              onChange={(e) => handleFieldChange('defaultCurrency', e.target.value as CurrencyCode)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-semibold"
            >
              <option value="BDT">BDT (৳) — Bangladeshi Taka</option>
              <option value="USD">USD ($) — US Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
              <option value="GBP">GBP (£) — British Pound</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Tax Label
            </label>
            <input
              type="text"
              value={localSettings.defaultTaxLabel}
              onChange={(e) => handleFieldChange('defaultTaxLabel', e.target.value)}
              placeholder="VAT"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Tax Rate %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="any"
              value={localSettings.defaultTaxRate}
              onChange={(e) => handleFieldChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Payment Terms
            </label>
            <input
              type="text"
              value={localSettings.defaultPaymentTerms}
              onChange={(e) => handleFieldChange('defaultPaymentTerms', e.target.value)}
              placeholder="Due within 7 days from invoice date"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Invoice Template
            </label>
            <select
              value={localSettings.defaultTemplate}
              onChange={(e) => handleFieldChange('defaultTemplate', e.target.value as InvoiceTemplateId)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="codenest-modern">Codenest Modern (Default)</option>
              <option value="codenest-classic">Codenest Classic</option>
              <option value="codenest-minimal">Codenest Minimal</option>
              <option value="codenest-corporate">Codenest Corporate</option>
              <option value="codenest-dark-accent">Codenest Dark Accent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-sky-600" />
          Standard Notes &amp; Legal Terms
        </h4>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Customer Note
            </label>
            <textarea
              rows={2}
              value={localSettings.defaultNotes}
              onChange={(e) => handleFieldChange('defaultNotes', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Terms &amp; Conditions
            </label>
            <textarea
              rows={4}
              value={localSettings.defaultTerms}
              onChange={(e) => handleFieldChange('defaultTerms', e.target.value)}
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


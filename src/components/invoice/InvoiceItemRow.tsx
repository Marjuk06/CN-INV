import React from 'react'
import { CurrencyCode, InvoiceItem, Service } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { Trash2, Sparkles } from 'lucide-react'

interface InvoiceItemRowProps {
  item: InvoiceItem
  index: number
  currency: CurrencyCode
  availableServices: Service[]
  onChange: (updatedItem: InvoiceItem) => void
  onRemove: () => void
}

export const InvoiceItemRow: React.FC<InvoiceItemRowProps> = ({
  item,
  index,
  currency,
  availableServices,
  onChange,
  onRemove,
}) => {
  const handleFieldChange = (field: keyof InvoiceItem, value: unknown) => {
    const updated = { ...item, [field]: value }

    const qty = Number(field === 'quantity' ? value : updated.quantity) || 0
    const price = Number(field === 'unitPrice' ? value : updated.unitPrice) || 0
    const base = qty * price

    let disc = 0
    const discType = field === 'discountType' ? value : updated.discountType
    const discVal = Number(field === 'discountValue' ? value : updated.discountValue) || 0

    if (discType === 'percentage') {
      disc = (base * discVal) / 100
    } else {
      disc = discVal
    }

    updated.amount = Math.max(0, base - disc)
    onChange(updated)
  }

  const handleSelectService = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value
    if (!serviceId) return

    const srv = availableServices.find((s) => s.id === serviceId)
    if (!srv) return

    const base = item.quantity * srv.defaultPrice
    let disc = 0
    if (item.discountType === 'percentage') {
      disc = (base * item.discountValue) / 100
    } else {
      disc = item.discountValue
    }

    onChange({
      ...item,
      description: `${srv.name}${srv.description ? ` — ${srv.description}` : ''}`,
      unitPrice: srv.defaultPrice,
      taxPercentage: srv.defaultTax,
      amount: Math.max(0, base - disc),
    })
  }

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono font-bold text-slate-400">
          #{String(index + 1).padStart(2, '0')}
        </span>

        {availableServices.length > 0 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <select
              value=""
              onChange={handleSelectService}
              className="text-[11px] py-1 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="">Insert from Service Catalog...</option>
              {availableServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({formatCurrency(s.defaultPrice, currency)})
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
          title="Remove item"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
          Item / Service Description
        </label>
        <textarea
          rows={2}
          value={item.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="e.g. Full-stack React & Next.js web application with PostgreSQL database..."
          required
          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-end">
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Qty
          </label>
          <input
            type="number"
            min="0.01"
            step="any"
            value={item.quantity || ''}
            onChange={(e) => handleFieldChange('quantity', parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 text-center"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Price ({currency})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={item.unitPrice || ''}
            onChange={(e) => handleFieldChange('unitPrice', parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 text-right"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Discount
          </label>
          <div className="flex">
            <input
              type="number"
              min="0"
              step="any"
              value={item.discountValue || ''}
              onChange={(e) => handleFieldChange('discountValue', parseFloat(e.target.value) || 0)}
              className="w-full min-w-0 px-2 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 text-right"
            />
            <select
              value={item.discountType}
              onChange={(e) => handleFieldChange('discountType', e.target.value as 'percentage' | 'fixed')}
              className="px-1.5 py-1.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-r-lg text-slate-700 dark:text-slate-300"
            >
              <option value="percentage">%</option>
              <option value="fixed">{currency}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            Tax %
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            value={item.taxPercentage || ''}
            onChange={(e) => handleFieldChange('taxPercentage', parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 text-center"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 text-right">
            Amount
          </label>
          <div className="px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg text-right truncate">
            {formatCurrency(item.amount, currency)}
          </div>
        </div>
      </div>
    </div>
  )
}

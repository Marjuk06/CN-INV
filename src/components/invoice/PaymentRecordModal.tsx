import React, { useState } from 'react'
import { Invoice, PaymentRecord } from '../../types/invoice'
import { Modal } from '../common/Modal'
import { formatCurrency } from '../../services/currency'
import { CreditCard, Trash2, Calendar, Hash } from 'lucide-react'

interface PaymentRecordModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice
  onAddPayment: (payment: Omit<PaymentRecord, 'id'>) => void
  onDeletePayment: (paymentId: string) => void
}

export const PaymentRecordModal: React.FC<PaymentRecordModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onAddPayment,
  onDeletePayment,
}) => {
  const [amount, setAmount] = useState<number>(invoice.remainingBalance > 0 ? invoice.remainingBalance : 0)
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [method, setMethod] = useState<PaymentRecord['method']>('Bank Transfer')
  const [transactionId, setTransactionId] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount <= 0) return

    onAddPayment({
      amount: Number(amount),
      date,
      method,
      transactionId: transactionId.trim() || undefined,
      notes: notes.trim() || undefined,
    })

    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Tracking"
      subtitle={`Invoice ${invoice.invoiceNumber} • Grand Total: ${formatCurrency(invoice.grandTotal, invoice.currency)}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Payment Summary Header */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
            <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">
              {formatCurrency(invoice.grandTotal, invoice.currency)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Paid</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatCurrency(invoice.paidAmount, invoice.currency)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">Balance</span>
            <span className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400">
              {formatCurrency(invoice.remainingBalance, invoice.currency)}
            </span>
          </div>
        </div>

        {/* Record New Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-sky-600" />
            Record New Transaction
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount ({invoice.currency})
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                max={invoice.remainingBalance > 0 ? invoice.remainingBalance : undefined}
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
              />
              {invoice.remainingBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(invoice.remainingBalance)}
                  className="text-[11px] text-sky-600 hover:text-sky-700 mt-1 font-medium"
                >
                  Pay remaining ({formatCurrency(invoice.remainingBalance, invoice.currency)})
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentRecord['method'])}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Transaction ID / Reference
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. TXN-CITY-8942910"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <Hash className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Payment Memo / Note
            </label>
            <input
              type="text"
              placeholder="e.g. Milestone 1 advance payment received"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={amount <= 0}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              Record Payment
            </button>
          </div>
        </form>

        {/* Existing Payments List */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Payment History ({invoice.payments.length})
            </h4>
            <div className="space-y-2">
              {invoice.payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatCurrency(p.amount, invoice.currency)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">
                        {p.method}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span>{p.date}</span>
                      {p.transactionId && <span> • Ref: {p.transactionId}</span>}
                      {p.notes && <span> • {p.notes}</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeletePayment(p.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                    title="Delete payment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

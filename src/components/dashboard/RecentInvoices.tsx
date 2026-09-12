import React from 'react'
import { Invoice } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { StatusBadge } from '../common/StatusBadge'
import { Edit, Copy, Download, Share2, ArrowRight, FileText } from 'lucide-react'

interface RecentInvoicesProps {
  invoices: Invoice[]
  onSelectInvoice: (invoice: Invoice) => void
  onDuplicateInvoice: (id: string) => void
  onShareInvoice: (invoice: Invoice) => void
  onDownloadPDF: (invoice: Invoice) => void
  onViewAll: () => void
}

export const RecentInvoices: React.FC<RecentInvoicesProps> = ({
  invoices,
  onSelectInvoice,
  onDuplicateInvoice,
  onShareInvoice,
  onDownloadPDF,
  onViewAll,
}) => {
  const recent = invoices.slice(0, 5)

  return (
    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-900/5 overflow-hidden">
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Invoices</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Latest client billing activity</p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No Invoices Yet</h4>
          <p className="text-xs text-slate-500 max-w-[250px] mb-4">Your billing history will appear here once you create your first invoice.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200/50 dark:border-slate-800/50">
              <th className="py-3 px-4">Invoice</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4 hidden sm:table-cell">Date</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((inv) => (
              <tr
                key={inv.id}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                onClick={() => onSelectInvoice(inv)}
              >
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {inv.customerSnapshot.name}
                  </div>
                  {inv.customerSnapshot.companyName && (
                    <div className="text-[11px] text-slate-400">{inv.customerSnapshot.companyName}</div>
                  )}
                </td>
                <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 dark:text-slate-400">
                  <div>{inv.date}</div>
                  <div className="text-[10px] text-slate-400">Due: {inv.dueDate}</div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(inv.grandTotal, inv.currency)}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={inv.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectInvoice(inv)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Invoice"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateInvoice(inv.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onShareInvoice(inv)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadPDF(inv)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}

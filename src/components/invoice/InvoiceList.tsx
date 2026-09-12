import React, { useState, useMemo } from 'react'
import { Invoice, InvoiceStatus } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { StatusBadge } from '../common/StatusBadge'
import { EmptyState } from '../common/EmptyState'
import { ConfirmDialog } from '../common/ConfirmDialog'
import {
  Search,
  Plus,
  Edit,
  Copy,
  Download,
  Share2,
  Trash2,
  Receipt,
  ArrowUpDown,
  Filter,
} from 'lucide-react'

interface InvoiceListProps {
  invoices: Invoice[]
  onSelectInvoice: (invoice: Invoice) => void
  onCreateInvoice: () => void
  onDuplicateInvoice: (id: string) => void
  onShareInvoice: (invoice: Invoice) => void
  onDownloadPDF: (invoice: Invoice) => void
  onDeleteInvoice: (id: string) => void
}

type SortField = 'date' | 'invoiceNumber' | 'grandTotal' | 'status'
type SortOrder = 'asc' | 'desc'

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onSelectInvoice,
  onCreateInvoice,
  onDuplicateInvoice,
  onShareInvoice,
  onDownloadPDF,
  onDeleteInvoice,
}) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const filterTabs = [
    { id: 'all', label: 'All Invoices' },
    { id: 'Draft', label: 'Draft' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Paid', label: 'Paid' },
    { id: 'Partially Paid', label: 'Partially Paid' },
    { id: 'Overdue', label: 'Overdue' },
    { id: 'Cancelled', label: 'Cancelled' },
  ]

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        if (statusFilter !== 'all' && inv.status !== statusFilter) return false
        if (!search.trim()) return true
        const query = search.toLowerCase()
        return (
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.customerSnapshot.name.toLowerCase().includes(query) ||
          (inv.customerSnapshot.companyName && inv.customerSnapshot.companyName.toLowerCase().includes(query)) ||
          inv.amountInWords.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => {
        let compare = 0
        if (sortField === 'date') {
          compare = new Date(a.date).getTime() - new Date(b.date).getTime()
        } else if (sortField === 'grandTotal') {
          compare = a.grandTotal - b.grandTotal
        } else if (sortField === 'invoiceNumber') {
          compare = a.invoiceNumber.localeCompare(b.invoiceNumber)
        } else if (sortField === 'status') {
          compare = a.status.localeCompare(b.status)
        }
        return sortOrder === 'asc' ? compare : -compare
      })
  }, [invoices, search, statusFilter, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Invoices Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, track, filter, and manage all client invoices
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateInvoice}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-sky-600/20 transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 space-y-4 shadow-lg shadow-slate-900/5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by invoice number, client name, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {filteredInvoices.length} invoices found
            </span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      {filteredInvoices.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-6 h-6" />}
          title={search ? 'No matching invoices found' : 'No invoices yet'}
          description={
            search
              ? `No invoices match your search "${search}". Try searching for another keyword or clear filters.`
              : 'Create your first professional invoice for your software client.'
          }
          actionLabel={search ? 'Clear Search' : '+ Create Invoice'}
          onAction={search ? () => setSearch('') : onCreateInvoice}
        />
      ) : (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-lg shadow-slate-900/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200/50 dark:border-slate-800/50">
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
                    onClick={() => toggleSort('invoiceNumber')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Invoice</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Customer</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Date &amp; Due</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
                    onClick={() => toggleSort('grandTotal')}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Total Amount</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 text-center cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
                    onClick={() => toggleSort('status')}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
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
                        <div className="text-[11px] text-slate-400">
                          {inv.customerSnapshot.companyName}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <div>{inv.date}</div>
                      <div className="text-[10px] text-slate-400">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(inv.grandTotal, inv.currency)}
                      </div>
                      {inv.paidAmount > 0 && inv.remainingBalance > 0 && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                          Bal: {formatCurrency(inv.remainingBalance, inv.currency)}
                        </div>
                      )}
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
                          title="Edit"
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
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteInvoice(deleteTargetId)
        }}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmText="Delete Invoice"
        variant="danger"
      />
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import { Customer, Invoice } from '../../types/invoice'
import { CustomerModal } from './CustomerModal'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { EmptyState } from '../common/EmptyState'
import { formatCurrency } from '../../services/currency'
import { Search, Plus, Edit, Trash2, Users, FilePlus, Mail, Phone, MapPin } from 'lucide-react'

interface CustomerListProps {
  customers: Customer[]
  invoices: Invoice[]
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => void
  onDeleteCustomer: (id: string) => void
  onCreateInvoiceForCustomer: (customer: Customer) => void
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  invoices,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onCreateInvoiceForCustomer,
}) => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  // Calculate invoice count and total billed for each customer
  const customerStats = useMemo(() => {
    const stats: Record<string, { count: number; totalBilled: number }> = {}

    invoices.forEach((inv) => {
      const custId = inv.customerSnapshot.id
      if (custId) {
        if (!stats[custId]) stats[custId] = { count: 0, totalBilled: 0 }
        stats[custId].count += 1
        stats[custId].totalBilled += inv.grandTotal
      }
    })

    return stats
  }, [invoices])

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.companyName && c.companyName.toLowerCase().includes(q)) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    )
  }, [customers, search])

  const handleEdit = (c: Customer) => {
    setEditingCustomer(c)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setEditingCustomer(null)
    setIsModalOpen(true)
  }

  const handleSave = (data: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, data)
    } else {
      onAddCustomer(data)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your corporate clients, billing contacts, and payment records
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-sky-600/20 transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by client name, company, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Customers List Grid */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title={search ? 'No matching clients found' : 'No customers yet'}
          description={
            search
              ? `No customers match your search "${search}".`
              : 'Add your first corporate client to streamline invoice generation.'
          }
          actionLabel={search ? 'Clear Search' : '+ Add Customer'}
          onAction={search ? () => setSearch('') : handleCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => {
            const stats = customerStats[c.id] || { count: 0, totalBilled: 0 }

            return (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {c.name}
                      </h3>
                      {c.companyName && (
                        <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                          {c.companyName}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Customer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {c.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                    {(c.city || c.address) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {[c.address, c.city, c.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Billed Summary & Quick Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Invoiced ({stats.count})
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {formatCurrency(stats.totalBilled, 'BDT')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onCreateInvoiceForCustomer(c)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 dark:hover:text-sky-400 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>Create Invoice</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={editingCustomer}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteCustomer(deleteTargetId)
        }}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? Existing invoices will keep their snapshot data intact."
        confirmText="Delete Customer"
        variant="danger"
      />
    </div>
  )
}

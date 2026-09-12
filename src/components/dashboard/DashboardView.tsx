import React from 'react'
import { Invoice } from '../../types/invoice'
import { DashboardStats } from './DashboardStats'
import { RevenueChart } from './RevenueChart'
import { RecentInvoices } from './RecentInvoices'
import { Users, Layers, Palette, ArrowRight } from 'lucide-react'

interface DashboardViewProps {
  invoices: Invoice[]
  onCreateInvoice: () => void
  onSelectInvoice: (invoice: Invoice) => void
  onDuplicateInvoice: (id: string) => void
  onShareInvoice: (invoice: Invoice) => void
  onDownloadPDF: (invoice: Invoice) => void
  onNavigate: (tab: 'invoices' | 'customers' | 'services' | 'templates' | 'settings') => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  onCreateInvoice,
  onSelectInvoice,
  onDuplicateInvoice,
  onShareInvoice,
  onDownloadPDF,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <DashboardStats invoices={invoices} onCreateInvoice={onCreateInvoice} />

      {/* Analytics & Settlement Health */}
      <RevenueChart invoices={invoices} />

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('customers')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all text-left flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                Manage Customers
              </div>
              <div className="text-[11px] text-slate-400">Add or edit client profiles</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('services')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all text-left flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Services Catalog
              </div>
              <div className="text-[11px] text-slate-400">Configure tech offerings</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('templates')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all text-left flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Invoice Templates
              </div>
              <div className="text-[11px] text-slate-400">5 professional A4 themes</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
        </button>
      </div>

      {/* Recent Invoices Table */}
      <RecentInvoices
        invoices={invoices}
        onSelectInvoice={onSelectInvoice}
        onDuplicateInvoice={onDuplicateInvoice}
        onShareInvoice={onShareInvoice}
        onDownloadPDF={onDownloadPDF}
        onViewAll={() => onNavigate('invoices')}
      />
    </div>
  )
}

import React from 'react'
import { Invoice } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { Receipt, CheckCircle2, Clock, AlertCircle, Plus, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
  invoices: Invoice[]
  onCreateInvoice: () => void
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ invoices, onCreateInvoice }) => {
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.status !== 'Cancelled' ? inv.grandTotal : 0), 0)
  const paidTotal = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)
  
  // Outstanding pending & overdue
  const pendingTotal = invoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Sent' || inv.status === 'Partially Paid')
    .reduce((sum, inv) => sum + (inv.remainingBalance > 0 ? inv.remainingBalance : inv.grandTotal), 0)

  const overdueTotal = invoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + (inv.remainingBalance > 0 ? inv.remainingBalance : inv.grandTotal), 0)

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-medium border border-sky-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Professional Billing Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Codenest Invoice
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Manage software development invoices, track client receivables, generate A4 PDFs and share digital bills effortlessly.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateInvoice}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:shadow-sky-500/40 hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Invoice</span>
        </button>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced */}
        <div className="p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Invoiced
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalInvoiced, 'BDT')}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Across {invoices.length} total invoices
            </p>
          </div>
        </div>

        {/* Paid Revenue */}
        <div className="p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Paid Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatCurrency(paidTotal, 'BDT')}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalInvoiced > 0 ? Math.round((paidTotal / totalInvoiced) * 100) : 0}% recovery rate
            </p>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {formatCurrency(pendingTotal, 'BDT')}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Awaiting client clearance
            </p>
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Overdue
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400">
              {formatCurrency(overdueTotal, 'BDT')}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Requires immediate follow-up
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

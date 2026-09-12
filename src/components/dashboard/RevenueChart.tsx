import React from 'react'
import { Invoice } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { PieChart, ArrowUpRight } from 'lucide-react'

interface RevenueChartProps {
  invoices: Invoice[]
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ invoices }) => {
  const total = invoices.reduce((acc, inv) => acc + (inv.status !== 'Cancelled' ? inv.grandTotal : 0), 0)
  const paid = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0)
  
  const pending = invoices
    .filter((i) => i.status === 'Pending' || i.status === 'Sent' || i.status === 'Partially Paid')
    .reduce((acc, i) => acc + (i.remainingBalance > 0 ? i.remainingBalance : i.grandTotal), 0)

  const overdue = invoices
    .filter((i) => i.status === 'Overdue')
    .reduce((acc, i) => acc + (i.remainingBalance > 0 ? i.remainingBalance : i.grandTotal), 0)

  const paidPct = total > 0 ? Math.round((paid / total) * 100) : 0
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0
  const overduePct = total > 0 ? Math.round((overdue / total) * 100) : 0

  return (
    <div className="p-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-5 shadow-lg shadow-slate-900/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revenue Settlement Health</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Proportional breakdown of invoiced capital</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
            {paidPct}% Collected
          </span>
        </div>
      </div>

      {/* Multi-segment progress bar */}
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
        <div
          style={{ width: `${paidPct}%` }}
          className="bg-emerald-500 transition-all duration-500 rounded-l-full"
          title={`Paid: ${paidPct}%`}
        />
        <div
          style={{ width: `${pendingPct}%` }}
          className="bg-amber-500 transition-all duration-500"
          title={`Pending: ${pendingPct}%`}
        />
        <div
          style={{ width: `${overduePct}%` }}
          className="bg-rose-500 transition-all duration-500 rounded-r-full"
          title={`Overdue: ${overduePct}%`}
        />
      </div>

      {/* Legend & Breakdown grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Settled / Paid
            </span>
            <span>{paidPct}%</span>
          </div>
          <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
            {formatCurrency(paid, 'BDT')}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Pending
            </span>
            <span>{pendingPct}%</span>
          </div>
          <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
            {formatCurrency(pending, 'BDT')}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Overdue
            </span>
            <span>{overduePct}%</span>
          </div>
          <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
            {formatCurrency(overdue, 'BDT')}
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { InvoiceStatus } from '../../types/invoice'

interface StatusBadgeProps {
  status: InvoiceStatus
  className?: string
  size?: 'sm' | 'md'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'md' }) => {
  const styles: Record<InvoiceStatus, { bg: string; text: string; dot: string; border: string }> = {
    Draft: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
      dot: 'bg-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
    },
    Sent: {
      bg: 'bg-sky-50 dark:bg-sky-950/60',
      text: 'text-sky-700 dark:text-sky-300',
      dot: 'bg-sky-500',
      border: 'border-sky-200 dark:border-sky-800',
    },
    Pending: {
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500',
      border: 'border-amber-200 dark:border-amber-800',
    },
    Paid: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    'Partially Paid': {
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      text: 'text-indigo-700 dark:text-indigo-300',
      dot: 'bg-indigo-500',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    Overdue: {
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-300',
      dot: 'bg-rose-500',
      border: 'border-rose-200 dark:border-rose-800',
    },
    Cancelled: {
      bg: 'bg-zinc-100 dark:bg-zinc-800',
      text: 'text-zinc-500 dark:text-zinc-400',
      dot: 'bg-zinc-400',
      border: 'border-zinc-200 dark:border-zinc-700',
    },
  }

  const current = styles[status] || styles.Draft
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
      <span>{status}</span>
    </span>
  )
}

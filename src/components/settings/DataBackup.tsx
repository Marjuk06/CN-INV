import React, { useRef, useState } from 'react'
import { useInvoice } from '../../context/InvoiceContext'
import { useToast } from '../../context/ToastContext'
import { storageService } from '../../services/storage'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { Download, Upload, RefreshCw, Database, AlertTriangle, ShieldCheck } from 'lucide-react'

export const DataBackup: React.FC = () => {
  const { resetDemoData, importBackupData } = useInvoice()
  const { success, error } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  const handleExport = () => {
    try {
      const backup = storageService.exportBackup()
      const json = JSON.stringify(backup, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const dateStr = new Date().toISOString().split('T')[0]
      a.href = url
      a.download = `Codenest-Invoice-Backup-${dateStr}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      success('Backup exported successfully!')
    } catch (err) {
      console.error(err)
      error('Failed to export backup data.')
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        importBackupData(parsed)
      } catch (err) {
        console.error(err)
        error('Invalid JSON file format.')
      }
    }
    reader.readAsText(file)
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Data Management &amp; Portability
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Local-first offline backup, restore, and demo data synchronization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Export System Backup
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Download all invoices, client records, service templates, and company preferences as a standalone JSON file.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (JSON)</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Restore System Backup
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Import and restore data from a previously generated Codenest backup file.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Upload className="w-4 h-4" />
              <span>Import &amp; Restore</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset to Demo */}
      <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Reset to Codenest Demo Data
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
              Resets all invoices, customers, and services back to the initial sample records for Codenest software company.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetDemoData()
          setIsResetConfirmOpen(false)
        }}
        title="Reset to Sample Demo Data?"
        message="This will overwrite current local changes with the original Codenest demonstration records. Proceed?"
        confirmText="Reset to Demo"
        variant="danger"
      />
    </div>
  )
}

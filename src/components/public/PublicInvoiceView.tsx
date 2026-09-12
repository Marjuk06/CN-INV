import React, { useState } from 'react'
import { Invoice } from '../../types/invoice'
import { CodenestModern } from '../templates/CodenestModern'
import { CodenestClassic } from '../templates/CodenestClassic'
import { CodenestMinimal } from '../templates/CodenestMinimal'
import { CodenestCorporate } from '../templates/CodenestCorporate'
import { CodenestDarkAccent } from '../templates/CodenestDarkAccent'
import { generateInvoicePDF } from '../../services/pdfGenerator'
import { printInvoice } from '../../services/printService'
import { Download, Printer, ShieldCheck, ArrowLeft } from 'lucide-react'

interface PublicInvoiceViewProps {
  invoice: Invoice | null
  onBackToApp?: () => void
}

export const PublicInvoiceView: React.FC<PublicInvoiceViewProps> = ({ invoice, onBackToApp }) => {
  const [isExporting, setIsExporting] = useState(false)

  if (!invoice) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h1 className="text-xl font-bold text-slate-900">Invoice Not Found</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The invoice link you requested is invalid, expired, or has been deleted.
          </p>
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Workspace</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    printInvoice({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.customerSnapshot.name,
    })
  }

  const handlePrint = () => {
    printInvoice({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.customerSnapshot.name,
    })
  }

  const renderTemplate = () => {
    switch (invoice.templateId) {
      case 'codenest-classic':
        return <CodenestClassic invoice={invoice} />
      case 'codenest-minimal':
        return <CodenestMinimal invoice={invoice} />
      case 'codenest-corporate':
        return <CodenestCorporate invoice={invoice} />
      case 'codenest-dark-accent':
        return <CodenestDarkAccent invoice={invoice} />
      case 'codenest-modern':
      default:
        return <CodenestModern invoice={invoice} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Customer Action Bar (Hidden during print) */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {invoice.companySnapshot.logoUrl ? (
              <img
                src={invoice.companySnapshot.logoUrl}
                alt={invoice.companySnapshot.name}
                className="h-7 w-auto object-contain"
              />
            ) : (
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                {invoice.companySnapshot.name}
              </span>
            )}
            <span className="hidden sm:inline text-xs text-slate-400">|</span>
            <span className="hidden sm:inline text-xs font-mono font-bold text-slate-700">
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm shadow-sky-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Preparing...' : 'Download PDF'}</span>
            </button>

            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                title="Admin Workspace"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Invoice Document Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex justify-center">
        <div
          id="public-invoice-render"
          className="print-page w-full max-w-[794px] bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-200 print:border-none print:shadow-none print:m-0"
        >
          {renderTemplate()}
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print text-center py-6 text-xs text-slate-400 border-t border-slate-200">
        <div className="flex items-center justify-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified billing statement issued by {invoice.companySnapshot.name}</span>
        </div>
      </footer>
    </div>
  )
}

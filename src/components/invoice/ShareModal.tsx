import React, { useState } from 'react'
import { Invoice } from '../../types/invoice'
import { Modal } from '../common/Modal'
import { formatCurrency } from '../../services/currency'
import { useToast } from '../../context/ToastContext'
import { Copy, Check, MessageSquare, Mail, Download, ExternalLink } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice
  onDownloadPDF?: () => void
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onDownloadPDF,
}) => {
  const { success } = useToast()
  const [copied, setCopied] = useState(false)

  // Public customer URL using hash route so it works in both dev & static deployment
  const publicUrl = `${window.location.origin}${window.location.pathname}#/invoice/${invoice.id}`

  const customerName = invoice.customerSnapshot.name || 'Valued Customer'
  const formattedAmount = formatCurrency(invoice.grandTotal, invoice.currency)

  const whatsappMessage = `Hello ${customerName},
Your invoice from Codenest is ready.

Invoice: ${invoice.invoiceNumber}
Amount: ${formattedAmount}
Due Date: ${invoice.dueDate}

View invoice:
${publicUrl}

Thank you,
Codenest`

  const emailSubject = `Invoice ${invoice.invoiceNumber} — Codenest`
  const emailBody = `Hello ${customerName},

Please find your invoice from Codenest below.

Invoice Number: ${invoice.invoiceNumber}
Amount: ${formattedAmount}
Due Date: ${invoice.dueDate}

View Invoice:
${publicUrl}

Thank you,
Codenest
${invoice.companySnapshot.website}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    success('Invoice public link copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage)
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank')
  }

  const handleEmail = () => {
    const mailto = `mailto:${invoice.customerSnapshot.email || ''}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailto
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Invoice"
      subtitle={`Share ${invoice.invoiceNumber} with ${customerName}`}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Public Link Box */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Public Customer Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Customers opening this link see a clean invoice without admin controls.
          </p>
        </div>

        {/* Action Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                Share via WhatsApp
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Send pre-filled message
              </div>
            </div>
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={handleEmail}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-sky-200 dark:border-sky-800/50 bg-sky-50/70 dark:bg-sky-950/40 hover:bg-sky-100/70 dark:hover:bg-sky-900/50 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                Share via Email
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Draft email with subject &amp; body
              </div>
            </div>
          </button>
        </div>

        {/* Preview Link / PDF */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
          >
            <span>Open Customer View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {onDownloadPDF && (
            <button
              type="button"
              onClick={() => {
                onDownloadPDF()
                onClose()
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

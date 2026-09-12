import React, { useState } from 'react'
import { Invoice, InvoiceTemplateId } from '../../types/invoice'
import { CodenestModern } from '../templates/CodenestModern'
import { CodenestClassic } from '../templates/CodenestClassic'
import { CodenestMinimal } from '../templates/CodenestMinimal'
import { CodenestCorporate } from '../templates/CodenestCorporate'
import { CodenestDarkAccent } from '../templates/CodenestDarkAccent'
import { ZoomIn, ZoomOut, RotateCcw, Palette } from 'lucide-react'

interface InvoicePreviewProps {
  invoice: Invoice
  onTemplateChange?: (templateId: InvoiceTemplateId) => void
  showTemplatePicker?: boolean
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onTemplateChange,
  showTemplatePicker = true,
}) => {
  const [zoom, setZoom] = useState<number>(100)

  const templateMap: Record<InvoiceTemplateId, React.ReactElement> = {
    'codenest-modern': <CodenestModern invoice={invoice} />,
    'codenest-classic': <CodenestClassic invoice={invoice} />,
    'codenest-minimal': <CodenestMinimal invoice={invoice} />,
    'codenest-corporate': <CodenestCorporate invoice={invoice} />,
    'codenest-dark-accent': <CodenestDarkAccent invoice={invoice} />,
  }

  const templates: { id: InvoiceTemplateId; label: string }[] = [
    { id: 'codenest-modern', label: 'Modern (Default)' },
    { id: 'codenest-classic', label: 'Classic' },
    { id: 'codenest-minimal', label: 'Minimal' },
    { id: 'codenest-corporate', label: 'Corporate' },
    { id: 'codenest-dark-accent', label: 'Dark Accent' },
  ]

  const currentTemplate = templateMap[invoice.templateId] || templateMap['codenest-modern']

  return (
    <div className="flex flex-col h-full">
      {/* Controls Bar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 rounded-t-2xl">
        {showTemplatePicker && onTemplateChange && (
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Theme:</span>
            <div className="flex gap-1 overflow-x-auto max-w-full">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTemplateChange(t.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    invoice.templateId === t.id
                      ? 'bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Zoom Out"
            aria-label="Zoom out preview"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono min-w-[40px] text-center text-[11px]">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Zoom In"
            aria-label="Zoom in preview"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoom !== 100 && (
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset Zoom"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Invoice Canvas Container */}
      <div className="flex-1 overflow-auto bg-slate-100/70 dark:bg-slate-950/70 p-4 sm:p-8 flex justify-center items-start print:p-0 print:!bg-transparent print:overflow-visible print:!border-none">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="w-full max-w-[794px] transition-all print:!transform-none print:max-w-none print:w-full print:!border-none"
        >
          {/* Print Root Target */}
          <div
            id="invoice-print-area"
            className="print-page bg-white shadow-xl rounded-sm overflow-hidden border border-slate-200/80 print:!border-none print:!shadow-none print:!m-0 print:!p-0 print:!rounded-none"
          >
            {currentTemplate}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Print & Export Service for Codenest Invoices
 * Handles native browser print dialog, document titles, and PDF downloads cleanly.
 */

export interface PrintOptions {
  invoiceNumber?: string
  clientName?: string
}

/**
 * Triggers clean native browser print for the invoice.
 * Temporarily sets the document title to the invoice number so the saved PDF
 * file has a clean default name like "INV-2026-004.pdf" instead of the website URL.
 */
export function printInvoice({ invoiceNumber, clientName }: PrintOptions = {}): void {
  const originalTitle = document.title

  // Format a professional filename for "Save as PDF"
  const cleanTitle = invoiceNumber
    ? clientName
      ? `Invoice-${invoiceNumber}-${clientName.replace(/[^a-zA-Z0-9]/g, '_')}`
      : `Invoice-${invoiceNumber}`
    : 'Invoice'

  document.title = cleanTitle

  // Trigger print after ensuring any active element has unfocused
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }

  const restoreTitle = () => {
    document.title = originalTitle
    window.removeEventListener('afterprint', restoreTitle)
  }

  window.addEventListener('afterprint', restoreTitle)

  // Give DOM a microtask tick then invoke print
  setTimeout(() => {
    window.print()
    // Fallback restoration in case afterprint does not fire in some browsers
    setTimeout(restoreTitle, 2000)
  }, 100)
}

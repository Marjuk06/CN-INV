import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface PDFExportOptions {
  filename?: string
  elementId: string
  onProgress?: (progress: number) => void
}

export async function generateInvoicePDF({
  elementId,
  filename = 'Codenest-Invoice.pdf',
  onProgress,
}: PDFExportOptions): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Invoice element #${elementId} not found`)
  }

  onProgress?.(10)

  // Temporarily ensure background colors and images are rendered clearly
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution for crisp printing & sharp text
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff',
    windowWidth: 1100, // Fixed rendering width ensuring desktop A4 layout
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId)
      if (clonedEl) {
        clonedEl.style.width = '794px' // Standard 96 DPI A4 width in px
        clonedEl.style.margin = '0 auto'
        clonedEl.style.boxShadow = 'none'
        clonedEl.style.border = 'none'
      }
    },
  })

  onProgress?.(60)

  const imgData = canvas.toDataURL('image/png')
  
  // Standard A4 dimensions in millimeters
  const pdfWidth = 210
  const pdfHeight = 297
  const imgWidth = pdfWidth
  const imgHeight = (canvas.height * pdfWidth) / canvas.width

  const pdf = new jsPDF('p', 'mm', 'a4')

  let heightLeft = imgHeight
  let position = 0
  let page = 1

  // First page
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
  heightLeft -= pdfHeight

  // Additional pages if needed
  while (heightLeft > 0) {
    position = -(page * pdfHeight)
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    page++
    heightLeft -= pdfHeight
  }

  onProgress?.(90)

  // Ensure filename ends with .pdf
  const finalFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`
  pdf.save(finalFilename)

  onProgress?.(100)
}

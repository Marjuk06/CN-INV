import { toPng } from 'html-to-image'
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

  // Use html-to-image to bypass html2canvas oklch parsing bugs
  // We force a specific width to ensure consistent A4 scaling
  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    style: {
      width: '794px', // Force desktop A4 width
      margin: '0',
      boxShadow: 'none',
      border: 'none',
    },
  })

  onProgress?.(60)

  // Standard A4 dimensions in millimeters
  const pdfWidth = 210
  const pdfHeight = 297
  
  const imgElement = new Image()
  imgElement.src = dataUrl
  await new Promise((resolve) => { imgElement.onload = resolve })
  
  let imgWidth = pdfWidth
  let imgHeight = (imgElement.height * pdfWidth) / imgElement.width

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  // If the rendered height is within single page bounds (with slight tolerance), fit on 1 page
  if (imgHeight <= pdfHeight + 10) {
    const renderHeight = Math.min(imgHeight, pdfHeight)
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, renderHeight, undefined, 'FAST')
  } else {
    // True multi-page document: add pages cleanly at full A4 width
    let position = 0
    let remainingHeight = imgHeight

    while (remainingHeight > 0) {
      if (position < 0) {
        pdf.addPage()
      }
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST')
      position -= pdfHeight
      remainingHeight -= pdfHeight
    }
  }

  onProgress?.(90)

  const finalFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`
  pdf.save(finalFilename)

  onProgress?.(100)
}

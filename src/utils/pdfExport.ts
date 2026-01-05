import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportElementToPdf({
  element,
  filename = 'strategic-initiative-portfolio.pdf',
  title,
}: {
  element: HTMLElement
  filename?: string
  title?: string
}) {
  // High DPI capture for board packs
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  })
  const imgData = canvas.toDataURL('image/png')

  // A4 landscape works well for dashboards; keep margins small.
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const margin = 24
  const maxW = pageWidth - margin * 2
  const maxH = pageHeight - margin * 2

  const imgW = canvas.width
  const imgH = canvas.height
  const scale = Math.min(maxW / imgW, maxH / imgH)
  const renderW = imgW * scale
  const renderH = imgH * scale

  if (title) {
    pdf.setFontSize(12)
    pdf.text(title, margin, margin - 8)
  }

  pdf.addImage(imgData, 'PNG', margin, margin, renderW, renderH)
  pdf.save(filename)
}


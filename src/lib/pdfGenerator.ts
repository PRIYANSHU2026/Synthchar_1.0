import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ComponentResult, ProductResult, ElementComposition } from '@/types';

interface GeneratePdfParams {
  title: string;
  compResults: ComponentResult[];
  weightPercents: number[];
  totalWeight: number;
  desiredBatch: number;
  gfResults?: ComponentResult[];
  gfWeightPercents?: number[];
  gfTotalWeight?: number;
  productResults?: ProductResult[];
  productWeightPercents?: number[];
  productTotalWeight?: number;
  elementComposition: ElementComposition[];
}

export const generatePdf = ({
  title,
  compResults,
  weightPercents,
  totalWeight,
  desiredBatch,
  gfResults,
  gfWeightPercents,
  gfTotalWeight,
  productResults,
  productWeightPercents,
  productTotalWeight,
  elementComposition
}: GeneratePdfParams): void => {
  // Create a new PDF document
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('SynthChar 1.0 - Batch Calculation Report', 14, 15);

  // Add subtitle with date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  // Horizontal line
  doc.setDrawColor(0, 71, 171);
  doc.setLineWidth(0.5);
  doc.line(14, 25, 195, 25);

  // Add section title
  doc.setFontSize(16);
  doc.setTextColor(0, 71, 171);
  doc.text('Precursor Matrix Calculation', 14, 35);
  doc.setTextColor(0, 0, 0);

  // Add precursor matrix table
  autoTable(doc, {
    startY: 40,
    head: [['Precursor', 'MW', 'Matrix (%)', 'Mol Qty', 'Batch wt (g)']],
    body: compResults.map((result, index) => [
      result.formula || '—',
      result.mw.toFixed(3),
      result.matrix.toFixed(3),
      result.molQty.toFixed(4),
      weightPercents[index].toFixed(4)
    ]),
    foot: [
      ['Net wt', '', compResults.reduce((a, c) => a + Number(c.matrix), 0).toFixed(3), totalWeight.toFixed(4), desiredBatch.toFixed(3)]
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 71, 171] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
  });

  // GF-Adjusted Product Matrix table has been removed as requested

  // Add Product Calculation Results (if available)
  if (productResults && productWeightPercents && productTotalWeight) {
    const currentY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(16);
    doc.setTextColor(0, 71, 171);
    doc.text('Product Calculation Results', 14, currentY);
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
      startY: currentY + 5,
      head: [['Product', 'MW', 'GF', 'Mol Qty', 'Batch wt (g)']],
      body: productResults.map((result, index) => [
        result.formula || '—',
        result.mw.toFixed(3),
        result.gf !== null ? result.gf.toFixed(3) : '—',
        result.molQty.toFixed(4),
        productWeightPercents[index].toFixed(4)
      ]),
      foot: [
        ['Net wt', '', '', productTotalWeight.toFixed(4), desiredBatch.toFixed(3)]
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 128, 128] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
  }

  // Add Element Composition
  const currentY = (doc as any).lastAutoTable.finalY + 10;

  // Add new page if needed
  if (currentY > 250) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 71, 171);
    doc.text('Element Composition', 14, 20);
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
      startY: 25,
      head: [['Element', 'Percentage (%)']],
      body: elementComposition.map(element => [
        element.element,
        element.percentage.toFixed(2)
      ]),
      theme: 'striped',
      headStyles: { fillColor: [0, 71, 171] }
    });
  } else {
    doc.setFontSize(16);
    doc.setTextColor(0, 71, 171);
    doc.text('Element Composition', 14, currentY);
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
      startY: currentY + 5,
      head: [['Element', 'Percentage (%)']],
      body: elementComposition.map(element => [
        element.element,
        element.percentage.toFixed(2)
      ]),
      theme: 'striped',
      headStyles: { fillColor: [0, 71, 171] }
    });
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `SynthChar 1.0 - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save('SynthChar_Batch_Report.pdf');
};

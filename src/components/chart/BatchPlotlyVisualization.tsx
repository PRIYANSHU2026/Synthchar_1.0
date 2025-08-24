import { type FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBatch } from '@/contexts/BatchContext';
import PlotlyVisualization from './PlotlyVisualization';
import { Button } from "@/components/ui/button";
import { generatePdf } from '@/lib/pdfGenerator';

const BatchPlotlyVisualization: FC = () => {
  const {
    elementComposition,
    compResults,
    weightPercents,
    totalWeight,
    desiredBatch,
    gfResults,
    gfWeightPercents,
    gfTotalWeight,
    productResults,
    productWeightPercents,
    productTotalWeight
  } = useBatch();

  // Function to handle PDF generation
  const handleGeneratePDF = async () => {
    if (generatePdf) {
      try {
        await generatePdf({
          title: 'Batch Calculation Report',
          elementComposition,
          compResults,
          weightPercents,
          totalWeight,
          desiredBatch,
          gfResults,
          gfWeightPercents,
          gfTotalWeight,
          productResults,
          productWeightPercents,
          productTotalWeight
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle>Advanced Batch Visualization</CardTitle>
          <CardDescription>
            Interactive visualization of your batch composition with Plotly
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={handleGeneratePDF}
            className="px-3 py-1 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-1 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            PDF Report
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <PlotlyVisualization />
      </CardContent>
    </Card>
  );
};

export default BatchPlotlyVisualization;
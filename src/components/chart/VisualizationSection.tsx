"use client";

import { type FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBatch } from '@/contexts/BatchContext';
import CompositionPieChart from './CompositionPieChart';
import CompositionSymbolicView from './CompositionSymbolicView';
import { generatePdf } from '@/lib/pdfGenerator';

const VisualizationSection: FC = () => {
  const [activeView, setActiveView] = useState<'pie' | 'symbolic'>('symbolic');
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

  const handleGeneratePDF = () => {
    generatePdf({
      title: 'SynthChar Batch Report',
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
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <CardTitle>Batch Composition Visualization</CardTitle>
          <CardDescription>
            Analyze the elemental composition of your batch
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="bg-white/80 border border-blue-200 rounded-lg p-1 flex shadow-sm">
            <button
              onClick={() => setActiveView('symbolic')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeView === 'symbolic'
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              Symbolic
            </button>
            <button
              onClick={() => setActiveView('pie')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeView === 'pie'
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              Pie Chart
            </button>
          </div>
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
        {activeView === 'pie' ? (
          <CompositionPieChart
            data={elementComposition}
            title="Element Composition Distribution"
          />
        ) : (
          <CompositionSymbolicView
            data={elementComposition}
            title="Symbolic Element Representation"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VisualizationSection;

"use client";

import type { FC } from 'react';
import type { ElementComposition } from '@/types';

interface CompositionSymbolicViewProps {
  data: ElementComposition[];
  title?: string;
}

// Helper function to format chemical formulas with subscripts
const formatChemicalFormula = (formula: string): JSX.Element => {
  // Split the formula into parts (elements and numbers)
  const parts = formula.split(/([A-Z][a-z]*)([0-9]*)/).filter(Boolean);
  
  return (
    <span>
      {parts.map((part, index) => {
        // If the part is a number, render it as subscript
        if (/^[0-9]+$/.test(part)) {
          return <sub key={index}>{part}</sub>;
        }
        // Otherwise, render it normally
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

const CompositionSymbolicView: FC<CompositionSymbolicViewProps> = ({ data, title }) => {
  // Sort data by percentage (highest first)
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="w-full flex flex-col">
      {title && <h3 className="text-lg font-medium mb-2 text-center">{title}</h3>}

      <div className="flex flex-wrap justify-center gap-3 p-4">
        {sortedData.map((compound) => (
          <div
            key={compound.element}
            className="relative bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-blue-100 dark:border-blue-800"
            style={{
              minWidth: `${Math.max(80, Math.min(200, compound.percentage * 2))}px`,
              minHeight: `${Math.max(80, Math.min(200, compound.percentage * 1.5))}px`,
            }}
          >
            <div
              className="absolute inset-0 rounded-lg opacity-30"
              style={{ backgroundColor: compound.color }}
            />
            <div className="relative flex flex-col items-center justify-center h-full">
              <div className="text-xl font-bold text-center">
                {formatChemicalFormula(compound.element)}
              </div>
              <span className="text-sm mt-2">{compound.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Tile size represents relative abundance in the composition</p>
      </div>
    </div>
  );
};

export default CompositionSymbolicView;

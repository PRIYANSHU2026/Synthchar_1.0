"use client";

import type { FC } from 'react';
import type { ElementComposition } from '@/types';

interface CompositionSymbolicViewProps {
  data: ElementComposition[];
  title?: string;
}

const CompositionSymbolicView: FC<CompositionSymbolicViewProps> = ({ data, title }) => {
  // Sort data by percentage (highest first)
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="w-full flex flex-col">
      {title && <h3 className="text-lg font-medium mb-2 text-center">{title}</h3>}

      <div className="flex flex-wrap justify-center gap-4 p-4">
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
              <span className="text-xl font-bold text-center" style={{ wordBreak: 'break-word' }}>{compound.element}</span>
              <span className="text-sm mt-2 font-medium">{compound.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Card size represents relative percentage in the batch composition</p>
      </div>
    </div>
  );
};

export default CompositionSymbolicView;

"use client";

import { useState, useRef, useEffect, type FC, type ChangeEvent } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useBatch } from '@/contexts/BatchContext';
import ElementAutoSuggest from './ElementAutoSuggest';
import { motion, AnimatePresence } from "framer-motion";

interface ComponentCardProps {
  index: number;
  formula: string;
  matrix: number;
  mw: number;
  isLast: boolean;
  onChange: (field: 'formula' | 'matrix') => (val: string | number | { target: { value: string } }) => void;
  onDelete?: () => void;
  onAddNext?: () => void;
  onFocusNext?: () => void;
}

// Individual precursor card
const ComponentCard: FC<ComponentCardProps> = ({ 
  index, 
  formula, 
  matrix, 
  mw, 
  isLast,
  onChange, 
  onDelete, 
  onAddNext,
  onFocusNext
}) => {
  const formulaInputRef = useRef<HTMLInputElement>(null);
  const matrixInputRef = useRef<HTMLInputElement>(null);
  
  // Create a direct onChange handler for formula to improve typing fluidity
  const handleFormulaChange = (value: string) => {
    onChange('formula')(value);
  };

  // Create a direct onChange handler for matrix to improve focus handling
  const handleMatrixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('matrix')(e);
  };
  
  // Handle key press events for navigation between inputs
  const handleFormulaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      // Focus will naturally move to matrix input
    } else if (e.key === 'Enter') {
      e.preventDefault();
      matrixInputRef.current?.focus();
    }
  };
  
  const handleMatrixKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLast && onAddNext) {
        onAddNext();
      } else if (onFocusNext) {
        onFocusNext();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-blue-100 dark:border-blue-900 shadow-lg shadow-blue-500/5 relative">
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500"
            onClick={onDelete}
            type="button"
          >
            <Trash2 size={14} />
          </Button>
        )}
        
        <CardContent className="pt-4 pb-2 px-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Precursor {index+1}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400 mr-6">
              MW: {mw ? mw.toFixed(3) : "-"}
            </span>
          </div>

          <div className="space-y-3">
            <div className="w-full">
              <ElementAutoSuggest
                value={formula}
                onChange={handleFormulaChange}
                atomics={useBatch().atomics}
                inputRef={formulaInputRef}
                inputProps={{
                  placeholder: "Chemical Formula (e.g. CaO)",
                  className: "w-full",
                  onKeyDown: handleFormulaKeyDown
                }}
              />
            </div>

            <div className="w-full">
              <Input
                type="number"
                placeholder="Matrix (%)"
                value={matrix ? (Math.round(matrix * 100) / 100) : ''}
                min={0}
                max={100}
                step={0.01}
                onChange={handleMatrixChange}
                onKeyDown={handleMatrixKeyDown}
                ref={matrixInputRef}
                className="w-full"
              />
            </div>
            
            {isLast && onAddNext && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-950"
                onClick={onAddNext}
                type="button"
              >
                <PlusCircle size={14} className="mr-1" />
                Add Precursor
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main batch input form
const BatchInputForm: FC = () => {
  const {
    components,
    numComponents,
    desiredBatch,
    handleComponentChange,
    setNumComponents,
    setDesiredBatch,
    warning
  } = useBatch();
  
  // Create refs for each component to enable focus navigation
  const componentRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  // Local state for managing component animations and focus
  const [localComponents, setLocalComponents] = useState(components);
  
  // Update local components when context components change
  useEffect(() => {
    setLocalComponents(components);
    // Ensure we have enough refs
    if (componentRefs.current.length !== components.length) {
      componentRefs.current = Array(components.length).fill(null);
    }
  }, [components]);
  
  // Handle adding a new component
  const handleAddComponent = () => {
    const newCount = numComponents + 1;
    setNumComponents(newCount);
    
    // Focus the new component after it's added
    setTimeout(() => {
      const lastIndex = newCount - 1;
      if (componentRefs.current[lastIndex]) {
        const formulaInput = componentRefs.current[lastIndex]?.querySelector('input');
        formulaInput?.focus();
      }
    }, 100);
  };
  
  // Handle removing a component
  const handleRemoveComponent = (index: number) => {
    if (numComponents <= 1) return; // Don't remove if it's the last one
    
    // Create a new array without the removed component
    const newComponents = [...localComponents];
    newComponents.splice(index, 1);
    
    // Update the number of components
    setNumComponents(numComponents - 1);
    
    // Focus the previous component after removal
    setTimeout(() => {
      const focusIndex = Math.min(index, newComponents.length - 1);
      if (focusIndex >= 0 && componentRefs.current[focusIndex]) {
        const formulaInput = componentRefs.current[focusIndex]?.querySelector('input');
        formulaInput?.focus();
      }
    }, 100);
  };
  
  // Handle focusing the next component
  const handleFocusNext = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < componentRefs.current.length) {
      const formulaInput = componentRefs.current[nextIndex]?.querySelector('input');
      formulaInput?.focus();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="num-components" className="text-lg font-medium">Batch Precursors</Label>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddComponent}
              className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-950"
            >
              <PlusCircle size={14} className="mr-1" />
              Add Precursor
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {components.map((comp, i) => (
            <div 
              key={`comp-${i}`} 
              ref={(el: HTMLDivElement | null) => {
                componentRefs.current[i] = el;
              }}
            >
              <ComponentCard
                index={i}
                formula={comp.formula}
                matrix={comp.matrix}
                mw={comp.mw}
                isLast={i === components.length - 1}
                onChange={field => handleComponentChange(i, field)}
                onDelete={numComponents > 1 ? () => handleRemoveComponent(i) : undefined}
                onAddNext={i === components.length - 1 ? handleAddComponent : undefined}
                onFocusNext={() => handleFocusNext(i)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col space-y-2 mt-6">
        <Label htmlFor="desired-batch" className="text-lg font-medium">Desired Batch Weight (g)</Label>
        <Input
          id="desired-batch"
          type="number"
          min={0.1}
          max={10000}
          value={desiredBatch}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDesiredBatch(Number(e.target.value.replace(',', '.')))}
          className="w-full md:w-48"
        />
      </div>

      {warning && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-md bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 shadow-sm"
        >
          <span className="text-amber-600 dark:text-amber-400 mr-1.5 font-bold">⚠</span>
          {warning}
        </motion.div>
      )}
    </div>
  );
};

export default BatchInputForm;

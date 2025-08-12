"use client";

import { useState, useRef, useEffect, type FC, type ChangeEvent, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBatch } from '@/contexts/BatchContext';
import ElementAutoSuggest from './ElementAutoSuggest';
import { molecularWeight } from '@/lib/chemistry';
import { motion } from 'framer-motion';

interface ProductCardProps {
  index: number;
  formula: string;
  precursorFormula: string;
  precursorMoles: number;
  productMoles: number;
  mw: number;
  gf: number | null;
  onChange: (field: 'formula' | 'precursorFormula' | 'precursorMoles' | 'productMoles') =>
    (val: string | number | { target: { value: string } }) => void;
  onFocusNext?: () => void;
}

// Individual product card with GF calculator
const ProductCard: FC<ProductCardProps> = ({
  index,
  formula,
  precursorFormula,
  precursorMoles,
  productMoles,
  mw,
  gf,
  onChange,
  onFocusNext
}) => {
  const { atomics, components } = useBatch();
  
  // Create refs for all input fields
  const formulaInputRef = useRef<HTMLInputElement>(null);
  const precursorSelectRef = useRef<HTMLSelectElement>(null);
  const precursorMolesInputRef = useRef<HTMLInputElement>(null);
  const productMolesInputRef = useRef<HTMLInputElement>(null);

  // Calculate molecular weights
  const precursorMW = molecularWeight(precursorFormula, atomics);
  const productMW = molecularWeight(formula, atomics);

  // Filter out empty formula components
  const availablePrecursors = components.filter(c => c.formula);

  // Direct onChange handlers to improve typing fluidity
  const handleFormulaChange = useCallback((value: string) => {
    onChange('formula')(value);
  }, [onChange]);

  const handlePrecursorFormulaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange('precursorFormula')(e.target.value);
  }, [onChange]);

  const handlePrecursorMolesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('precursorMoles')(e);
  }, [onChange]);

  const handleProductMolesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('productMoles')(e);
  }, [onChange]);

  // Key event handlers for navigation
  const handleFormulaKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      precursorSelectRef.current?.focus();
    }
  }, []);

  const handlePrecursorSelectKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      precursorMolesInputRef.current?.focus();
    }
  }, []);

  const handlePrecursorMolesKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      productMolesInputRef.current?.focus();
    }
  }, []);

  const handleProductMolesKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onFocusNext?.();
    }
  }, [onFocusNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-green-100 dark:border-green-900 shadow-lg shadow-green-500/5">
        <CardContent className="pt-4 pb-4 px-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-green-800 dark:text-green-300">Product {index+1}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              MW: {mw ? mw.toFixed(3) : "-"}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="w-full">
              <Label htmlFor={`product-formula-${index}`} className="text-xs mb-1 block">
                Product Formula
              </Label>
              <ElementAutoSuggest
                value={formula}
                onChange={handleFormulaChange}
                atomics={atomics}
                inputProps={{
                  id: `product-formula-${index}`,
                  placeholder: "Product Formula (e.g. B2O3)",
                  className: "w-full",
                  onKeyDown: handleFormulaKeyDown
                }}
                inputRef={formulaInputRef}
              />
            </div>
          </div>

          <div className="border-t pt-3 mt-2">
            <p className="text-sm font-medium mb-2 text-green-700 dark:text-green-400">Gravimetric Factor Calculator</p>

            {/* Precursor Formula Dropdown */}
            <div className="mb-2">
              <Label htmlFor={`precursor-formula-${index}`} className="text-xs mb-1 block">
                Precursor Formula
              </Label>
              <div className="relative">
                <select
                  id={`precursor-formula-${index}`}
                  value={precursorFormula}
                  onChange={handlePrecursorFormulaChange}
                  className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  ref={precursorSelectRef}
                  onKeyDown={handlePrecursorSelectKeyDown}
                >
                  {!precursorFormula && <option value="">Select precursor</option>}
                  {availablePrecursors.map((component, idx) => (
                    <option key={`precursor-option-${idx}`} value={component.formula}>
                      {component.formula} (Precursor {idx+1})
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs mt-1 text-gray-500">
                MW: {precursorMW?.toFixed(4) || "-"}
              </div>
            </div>

            {/* Precursor Moles */}
            <div className="mb-2">
              <Label htmlFor={`precursor-moles-${index}`} className="text-xs mb-1 block">
                Precursor Moles
              </Label>
              <Input
                id={`precursor-moles-${index}`}
                type="number"
                min={1}
                value={precursorMoles}
                onChange={handlePrecursorMolesChange}
                className="text-sm"
                ref={precursorMolesInputRef}
                onKeyDown={handlePrecursorMolesKeyDown}
              />
            </div>

            {/* Product Moles */}
            <div className="mb-2">
              <Label htmlFor={`product-moles-${index}`} className="text-xs mb-1 block">
                Product Moles
              </Label>
              <Input
                id={`product-moles-${index}`}
                type="number"
                min={1}
                value={productMoles}
                onChange={handleProductMolesChange}
                className="text-sm"
                ref={productMolesInputRef}
                onKeyDown={handleProductMolesKeyDown}
              />
              <div className="text-xs mt-1 text-gray-500">
                MW: {productMW?.toFixed(4) || "-"}
              </div>
            </div>

            {/* GF Result */}
            <div className="mt-3 pt-2 border-t border-green-100 dark:border-green-900">
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium">Gravimetric Factor:</div>
                <div className="text-base font-semibold text-green-700 dark:text-green-300 font-mono">
                  {gf !== null ? gf.toFixed(6) : "—"}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Formula: (Gravimetric Factor × Molecular Weight of Product × Matrix %) ÷ 1000 = Gram Equivalent Weight
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main batch product form
const BatchProductForm: FC = () => {
  const {
    products,
    numProducts,
    handleProductChange,
  } = useBatch();
  
  // Create refs for each product card
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize refs array when number of products changes
  useEffect(() => {
    productRefs.current = Array(numProducts).fill(null);
  }, [numProducts]);
  
  // Handle focusing the next product
  const handleFocusNext = useCallback((currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < numProducts && productRefs.current[nextIndex]) {
      // Find the ElementAutoSuggest input in the next product card
      const nextProductCard = productRefs.current[nextIndex];
      if (nextProductCard) {
        // Get the first input element which is the formula input
        const formulaInput = nextProductCard.querySelector('input');
        if (formulaInput) {
          setTimeout(() => {
            formulaInput.focus();
          }, 10);
        }
      }
    }
  }, [numProducts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Products automatically linked to precursors: {numProducts}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Change the number of precursors to adjust
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {products.map((product, i) => (
          <div
            key={`product-${i}`}
            ref={(el: HTMLDivElement | null) => {
              productRefs.current[i] = el;
            }}
          >
            <ProductCard
              index={i}
              formula={product.formula}
              precursorFormula={product.precursorFormula}
              precursorMoles={product.precursorMoles}
              productMoles={product.productMoles}
              mw={product.mw}
              gf={product.gf}
              onChange={field => handleProductChange(i, field)}
              onFocusNext={() => handleFocusNext(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchProductForm;

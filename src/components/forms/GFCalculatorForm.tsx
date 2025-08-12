"use client";

import type { FC, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBatch } from '@/contexts/BatchContext';
import { molecularWeight } from '@/lib/chemistry';
import { calculateGravimetricFactor, calculateComponentWeight, calculateTotalWeightWithGF } from '@/lib/gfUtils';

const GFCalculatorForm: FC = () => {
  const {
    atomics,
    precursorFormula,
    setPrecursorFormula,
    precursorMoles,
    setPrecursorMoles,
    productFormula,
    setProductFormula,
    productMoles,
    setProductMoles,
    gf
  } = useBatch();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/5">
        <CardTitle>Gravimetric Factor Calculator</CardTitle>
        <CardDescription>
          Calculate the ratio between the chemical weights of precursor and product.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Precursor Column */}
          <div className="space-y-4">
            <div className="text-center font-medium text-blue-700 dark:text-blue-400">Precursor</div>

            <div className="space-y-2">
              <Label htmlFor="precursor-formula">Precursor Formula</Label>
              <Input
                id="precursor-formula"
                value={precursorFormula}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrecursorFormula(e.target.value)}
                placeholder="e.g. H3BO3"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precursor-moles">Precursor Moles</Label>
              <Input
                id="precursor-moles"
                type="number"
                min={1}
                value={precursorMoles}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrecursorMoles(Number(e.target.value.replace(',', '.')))}
              />
            </div>

            <div className="text-sm">
              <span className="block text-muted-foreground">Molecular Weight:</span>
              <span className="font-mono">{molecularWeight(precursorFormula, atomics)?.toFixed(4) || "-"}</span>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <div className="text-center font-medium text-emerald-700 dark:text-emerald-400">Product</div>

            <div className="space-y-2">
              <Label htmlFor="product-formula">Product Formula</Label>
              <Input
                id="product-formula"
                value={productFormula}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProductFormula(e.target.value)}
                placeholder="e.g. B2O3"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-moles">Product Moles</Label>
              <Input
                id="product-moles"
                type="number"
                min={1}
                value={productMoles}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProductMoles(Number(e.target.value.replace(',', '.')))}
              />
            </div>

            <div className="text-sm">
              <span className="block text-muted-foreground">Molecular Weight:</span>
              <span className="font-mono">{molecularWeight(productFormula, atomics)?.toFixed(4) || "-"}</span>
            </div>
          </div>
        </div>

        {/* GF Result */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Gravimetric Factor:</div>
            <div className="text-xl font-semibold text-blue-700 dark:text-blue-300 font-mono">
              {gf !== null ? gf.toFixed(6) : "—"}
            </div>
          </div>

          {gf === null && (
            <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              Unable to calculate GF for the given formulas.
            </div>
          )}

          <div className="mt-2 text-xs text-muted-foreground">
            GF = (Precursor MW × Precursor Moles) ÷ (Product MW × Product Moles)
          </div>
          <div className="mt-1 text-xs text-muted-foreground font-semibold">
            For Precursor Method: (No. Of Moles × Molecular Weight of Precursor × Matrix %) ÷ 1000 = Gram Equivalent Weight
          </div>
          <div className="mt-1 text-xs text-muted-foreground font-semibold">
            For Product Method: (Gravimetric Factor × Molecular Weight of Product × Matrix %) ÷ 1000 = Gram Equivalent Weight
          </div>

          {/* Test Section for Formula Verification */}
          {gf !== null && (
            <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="text-sm font-medium mb-2">Formula Verification (New Implementation)</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Precursor MW:</div>
                <div className="font-mono">{molecularWeight(precursorFormula, atomics)?.toFixed(4) || "—"}</div>

                <div>Product MW:</div>
                <div className="font-mono">{molecularWeight(productFormula, atomics)?.toFixed(4) || "—"}</div>

                <div>GF Direct Calculation:</div>
                <div className="font-mono">
                  {molecularWeight(precursorFormula, atomics) && molecularWeight(productFormula, atomics) ?
                    calculateGravimetricFactor(
                      molecularWeight(precursorFormula, atomics)!,
                      precursorMoles,
                      molecularWeight(productFormula, atomics)!,
                      productMoles
                    ).toFixed(6) : "—"}
                </div>

                <div>Component Weight (30% Matrix):</div>
                <div className="font-mono">
                  {gf && molecularWeight(precursorFormula, atomics) ?
                    calculateComponentWeight(30, molecularWeight(precursorFormula, atomics)!, gf).toFixed(6) : "—"}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GFCalculatorForm;

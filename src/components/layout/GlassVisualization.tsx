"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBatch } from '@/contexts/BatchContext';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Import actual chart components
import CompositionChart from "@/components/chart/CompositionChart";
import TernaryPlot from "@/components/chart/TernaryPlot";
import StructureViewer from "@/components/chart/StructureViewer";
import PropertyMap from "@/components/chart/PropertyMap";

// Sample data for demonstration
const sampleCompositionData = [
  { label: "SiO2", value: 70, color: "#ff6384" },
  { label: "Na2O", value: 15, color: "#36a2eb" },
  { label: "CaO", value: 10, color: "#ffce56" },
  { label: "Al2O3", value: 5, color: "#4bc0c0" },
];

const sampleTernaryData = [
  { id: "glass1", a: 70, b: 20, c: 10, label: "Soda-lime glass", color: "#ff6384" },
  { id: "glass2", a: 60, b: 30, c: 10, label: "Borosilicate glass", color: "#36a2eb" },
  { id: "glass3", a: 50, b: 20, c: 30, label: "Lead glass", color: "#ffce56" },
  { id: "glass4", a: 40, b: 40, c: 20, label: "Aluminosilicate glass", color: "#4bc0c0" },
];

const sampleStructureData = [
  // Silicon atoms
  { element: "Si", x: 0, y: 0, z: 0 },
  { element: "Si", x: 3, y: 0, z: 0 },
  { element: "Si", x: 0, y: 3, z: 0 },
  { element: "Si", x: 0, y: 0, z: 3 },
  { element: "Si", x: 3, y: 3, z: 0 },
  { element: "Si", x: 3, y: 0, z: 3 },
  { element: "Si", x: 0, y: 3, z: 3 },
  { element: "Si", x: 3, y: 3, z: 3 },
  
  // Oxygen atoms (bridges)
  { element: "O", x: 1.5, y: 0, z: 0 },
  { element: "O", x: 0, y: 1.5, z: 0 },
  { element: "O", x: 0, y: 0, z: 1.5 },
  { element: "O", x: 3, y: 1.5, z: 0 },
  { element: "O", x: 3, y: 0, z: 1.5 },
  { element: "O", x: 1.5, y: 3, z: 0 },
  { element: "O", x: 0, y: 3, z: 1.5 },
  { element: "O", x: 1.5, y: 0, z: 3 },
  { element: "O", x: 0, y: 1.5, z: 3 },
  { element: "O", x: 1.5, y: 3, z: 3 },
  { element: "O", x: 3, y: 1.5, z: 3 },
  { element: "O", x: 3, y: 3, z: 1.5 },
  
  // Sodium atoms (modifiers)
  { element: "Na", x: 1.5, y: 1.5, z: 0 },
  { element: "Na", x: 1.5, y: 0, z: 1.5 },
  { element: "Na", x: 0, y: 1.5, z: 1.5 },
  { element: "Na", x: 3, y: 1.5, z: 1.5 },
  { element: "Na", x: 1.5, y: 3, z: 1.5 },
  { element: "Na", x: 1.5, y: 1.5, z: 3 },
];

const samplePropertyData = [
  {
    id: "glass1",
    x: 70, // SiO2 content
    y: 1450, // Melting point
    label: "Soda-lime glass",
    color: "#ff6384",
    size: 8,
    properties: {
      "SiO2 content (%)": 70,
      "Melting point (°C)": 1450,
      "Density (g/cm³)": 2.5,
      "Refractive index": 1.52,
      "Thermal expansion (10⁻⁷/°C)": 90,
      "Young's modulus (GPa)": 70
    }
  },
  {
    id: "glass2",
    x: 80,
    y: 1650,
    label: "Borosilicate glass",
    color: "#36a2eb",
    size: 8,
    properties: {
      "SiO2 content (%)": 80,
      "Melting point (°C)": 1650,
      "Density (g/cm³)": 2.23,
      "Refractive index": 1.47,
      "Thermal expansion (10⁻⁷/°C)": 33,
      "Young's modulus (GPa)": 63
    }
  },
  {
    id: "glass3",
    x: 60,
    y: 1200,
    label: "Lead glass",
    color: "#ffce56",
    size: 8,
    properties: {
      "SiO2 content (%)": 60,
      "Melting point (°C)": 1200,
      "Density (g/cm³)": 3.1,
      "Refractive index": 1.7,
      "Thermal expansion (10⁻⁷/°C)": 89,
      "Young's modulus (GPa)": 62
    }
  },
  {
    id: "glass4",
    x: 55,
    y: 1700,
    label: "Aluminosilicate glass",
    color: "#4bc0c0",
    size: 8,
    properties: {
      "SiO2 content (%)": 55,
      "Melting point (°C)": 1700,
      "Density (g/cm³)": 2.6,
      "Refractive index": 1.54,
      "Thermal expansion (10⁻⁷/°C)": 42,
      "Young's modulus (GPa)": 88
    }
  },
  {
    id: "glass5",
    x: 45,
    y: 1100,
    label: "Phosphate glass",
    color: "#9966ff",
    size: 8,
    properties: {
      "SiO2 content (%)": 45,
      "Melting point (°C)": 1100,
      "Density (g/cm³)": 2.65,
      "Refractive index": 1.56,
      "Thermal expansion (10⁻⁷/°C)": 140,
      "Young's modulus (GPa)": 50
    }
  },
];

const availableProperties = [
  "SiO2 content (%)",
  "Melting point (°C)",
  "Density (g/cm³)",
  "Refractive index",
  "Thermal expansion (10⁻⁷/°C)",
  "Young's modulus (GPa)"
];

const CompositionPlotSection = () => {
  const { components, products } = useBatch();
  const [plotType, setPlotType] = useState<"bar" | "pie" | "radar">("bar");
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Glass Composition Visualization</CardTitle>
        <CardDescription>
          Visualize the composition of your glass formulation with different chart types
        </CardDescription>
        <div className="flex items-center space-x-4 mt-2">
          <Label htmlFor="plot-type">Chart Type:</Label>
          <Select value={plotType} onValueChange={(value) => setPlotType(value as "bar" | "pie" | "radar")}>
            <SelectTrigger id="plot-type" className="w-[180px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="radar">Radar Chart</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">Export as Image</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <CompositionChart data={sampleCompositionData} type={plotType} />
        </div>
      </CardContent>
    </Card>
  );
};

const TernaryPlotSection = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Ternary Phase Diagram</CardTitle>
        <CardDescription>
          Visualize your glass composition in a ternary phase diagram to understand phase relationships
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <TernaryPlot 
            data={sampleTernaryData} 
            labels={["SiO2", "Na2O", "CaO"] as [string, string, string]} 
            gridLines={10} 
            showLabels={true} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

const StructureVisualizationSection = () => {
  const [structure, setStructure] = useState<"tetrahedral" | "octahedral" | "network">("tetrahedral");
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>3D Glass Structure Visualization</CardTitle>
        <CardDescription>
          Explore the 3D structure of different glass configurations
        </CardDescription>
        <div className="flex items-center space-x-4 mt-2">
          <Label htmlFor="structure-type">Structure Type:</Label>
          <Select 
            value={structure} 
            onValueChange={(value) => setStructure(value as "tetrahedral" | "octahedral" | "network")}>
            <SelectTrigger id="structure-type" className="w-[180px]">
              <SelectValue placeholder="Select structure type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tetrahedral">Tetrahedral</SelectItem>
              <SelectItem value="octahedral">Octahedral</SelectItem>
              <SelectItem value="network">Network</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">Rotate View</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <StructureViewer 
            atoms={sampleStructureData} 
            bondDistance={2.0} 
            rotationSpeed={0.005} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

const PropertyMapSection = () => {
  const [property, setProperty] = useState<"thermal" | "optical" | "mechanical">("thermal");
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Property Mapping</CardTitle>
        <CardDescription>
          Visualize how composition affects various glass properties
        </CardDescription>
        <div className="flex items-center space-x-4 mt-2">
          <Label htmlFor="property-type">Property:</Label>
          <Select 
            value={property} 
            onValueChange={(value) => setProperty(value as "thermal" | "optical" | "mechanical")}>
            <SelectTrigger id="property-type" className="w-[180px]">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thermal">Thermal Properties</SelectItem>
              <SelectItem value="optical">Optical Properties</SelectItem>
              <SelectItem value="mechanical">Mechanical Properties</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <PropertyMap 
            data={samplePropertyData} 
            availableProperties={availableProperties}
            defaultXProperty="SiO2 content (%)"
            defaultYProperty="Melting point (°C)"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default function GlassVisualization() {
  return (
    <div className="mx-auto px-4 py-10 max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter mb-2 text-blue-900 dark:text-blue-100">
          SynthChar 1.0 - Advanced Visualization
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Interactive 2D and 3D visualizations to explore various glass configurations and properties.
        </p>
      </header>

      <Tabs defaultValue="composition">
        <TabsList className="mb-6">
          <TabsTrigger value="composition">Composition</TabsTrigger>
          <TabsTrigger value="ternary">Ternary Plot</TabsTrigger>
          <TabsTrigger value="structure">3D Structure</TabsTrigger>
          <TabsTrigger value="properties">Property Map</TabsTrigger>
        </TabsList>

        <TabsContent value="composition">
          <div className="grid grid-cols-1 gap-8">
            <CompositionPlotSection />
          </div>
        </TabsContent>

        <TabsContent value="ternary">
          <div className="grid grid-cols-1 gap-8">
            <TernaryPlotSection />
          </div>
        </TabsContent>

        <TabsContent value="structure">
          <div className="grid grid-cols-1 gap-8">
            <StructureVisualizationSection />
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <div className="grid grid-cols-1 gap-8">
            <PropertyMapSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
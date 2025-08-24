import { useState, useEffect } from 'react';
import { useBatch } from '@/contexts/BatchContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import Plotly dynamically to avoid conflicts
import { Suspense, lazy } from 'react';
const Plot = lazy(() => import('react-plotly.js'));

// Import Plotly types without the implementation
import type { Data, Layout, Config } from 'plotly.js';

const PlotlyVisualization = () => {
  const { elementComposition } = useBatch();
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'radar' | 'scatter' | 'heatmap'>('pie');
  const [activeTab, setActiveTab] = useState('composition');

  // Filter out elements with very small percentages (less than 0.5%)
  const filteredData = elementComposition.filter(item => item.percentage >= 0.5);

  // If there are elements with < 0.5%, add an "Other" category
  const smallElements = elementComposition.filter(item => item.percentage < 0.5);
  let processedData = [...filteredData];
  
  if (smallElements.length > 0) {
    const otherPercentage = smallElements.reduce((sum, item) => sum + item.percentage, 0);
    if (otherPercentage > 0) {
      processedData.push({
        element: 'Other',
        percentage: otherPercentage,
        color: '#aaaaaa'
      });
    }
  }

  // Prepare data for Plotly based on chart type
  const getPlotData = (): Data[] => {
    switch (chartType) {
      case 'pie':
        return [{
          type: 'pie',
          values: processedData.map(item => item.percentage),
          labels: processedData.map(item => item.element),
          marker: {
            colors: processedData.map(item => item.color)
          },
          textinfo: 'label+percent',
          hoverinfo: 'label+percent',
          hole: 0.4
        }];
      
      case 'bar':
        return [{
          type: 'bar',
          x: processedData.map(item => item.element),
          y: processedData.map(item => item.percentage),
          marker: {
            color: processedData.map(item => item.color)
          },
          text: processedData.map(item => `${item.percentage.toFixed(2)}%`),
          textposition: 'auto',
          hoverinfo: 'x+y'
        }];
      
      case 'radar':
        return [{
          type: 'scatterpolar',
          r: processedData.map(item => item.percentage),
          theta: processedData.map(item => item.element),
          fill: 'toself',
          name: 'Element Composition',
          marker: { color: '#5B8FF9' }
        }];
      
      case 'scatter':
        // Create a scatter plot with element atomic number vs percentage
        return [{
          type: 'scatter',
          x: processedData.map((_, i) => i + 1), // Using index as x-axis
          y: processedData.map(item => item.percentage),
          mode: 'markers',
          marker: {
            size: processedData.map(item => Math.max(item.percentage * 0.5, 8)),
            color: processedData.map(item => item.color)
          },
          text: processedData.map(item => item.element),
          hoverinfo: 'text' as any
        }];
      
      case 'heatmap':
        // Create a simple heatmap representation
        const matrix = [processedData.map(item => item.percentage)];
        return [{
          type: 'heatmap',
          z: matrix,
          x: processedData.map(item => item.element),
          y: ['Composition'],
          colorscale: 'Viridis',
          showscale: true,
          text: processedData.map(item => `${item.percentage.toFixed(2)}%`) as any,
          hoverinfo: 'x' as any
        }];
      
      default:
        return [{
          type: 'pie',
          values: processedData.map(item => item.percentage),
          labels: processedData.map(item => item.element),
          marker: {
            colors: processedData.map(item => item.color)
          },
          textinfo: 'label+percent',
          hoverinfo: 'label+percent'
        }];
    }
  };

  // Layout configuration for different chart types
  const getLayout = (): Partial<Layout> => {
    const baseLayout: Partial<Layout> = {
      autosize: true,
      margin: { l: 50, r: 50, t: 50, b: 50 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'Inter, sans-serif' }
    };

    switch (chartType) {
      case 'pie':
        return {
          ...baseLayout,
          title: { text: 'Element Composition Distribution' },
        };
      
      case 'bar':
        return {
          ...baseLayout,
          title: { text: 'Element Composition Distribution' },
          xaxis: { title: 'Element' },
          yaxis: { title: 'Percentage (%)' }
        };
      
      case 'radar':
        return {
          ...baseLayout,
          title: { text: 'Element Composition Radar' },
          polar: {
            radialaxis: {
              visible: true,
              range: [0, Math.max(...processedData.map(item => item.percentage)) * 1.2]
            }
          }
        };
      
      case 'scatter':
        return {
          ...baseLayout,
          title: { text: 'Element Composition Scatter' },
          xaxis: { title: 'Element' },
          yaxis: { title: 'Percentage (%)' }
        };
      
      case 'heatmap':
        return {
          ...baseLayout,
          title: { text: 'Element Composition Heatmap' },
        };
      
      default:
        return baseLayout;
    }
  };

  // Config options for Plotly
  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    toImageButtonOptions: {
      format: 'png' as 'png' | 'svg' | 'jpeg' | 'webp',
      filename: 'batch_composition',
      height: 500,
      width: 700,
      scale: 2
    }
  };

  // Ternary plot data preparation
  const prepareTernaryData = (): Data[] | null => {
    // For demonstration, we'll use the top 3 elements for the ternary plot
    // In a real application, you might want to let users select which elements to include
    const top3Elements = [...processedData]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
    
    if (top3Elements.length < 3) {
      return null; // Not enough elements for a ternary plot
    }
    
    // Normalize the percentages of the top 3 elements to sum to 100%
    const totalPercentage = top3Elements.reduce((sum, item) => sum + item.percentage, 0);
    const normalizedElements = top3Elements.map(item => ({
      ...item,
      normalizedPercentage: (item.percentage / totalPercentage) * 100
    }));
    
    return [{
      type: 'scatterternary' as const,
      mode: 'markers',
      a: [normalizedElements[0].normalizedPercentage],
      b: [normalizedElements[1].normalizedPercentage],
      c: [normalizedElements[2].normalizedPercentage],
      text: ['Current Composition'],
      marker: {
        symbol: 'circle',
        size: 14,
        color: '#5B8FF9',
        line: { width: 1, color: '#000000' }
      }
    }];
  };

  // Ternary plot layout
  const getTernaryLayout = (): Partial<Layout> => {
    // For demonstration, we'll use the top 3 elements for the ternary plot
    const top3Elements = [...processedData]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
    
    if (top3Elements.length < 3) {
      return {}; // Not enough elements for a ternary plot
    }
    
    return {
      autosize: true,
      margin: { l: 50, r: 50, t: 50, b: 50 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      ternary: {
        aaxis: {
          title: top3Elements[0].element,
          min: 0.01, max: 0.99,
          ticksuffix: '%',
          linecolor: '#000000',
          showgrid: true
        },
        baxis: {
          title: top3Elements[1].element,
          min: 0.01, max: 0.99,
          ticksuffix: '%',
          linecolor: '#000000',
          showgrid: true
        },
        caxis: {
          title: top3Elements[2].element,
          min: 0.01, max: 0.99,
          ticksuffix: '%',
          linecolor: '#000000',
          showgrid: true
        },
        sum: 100
      },
      title: { text: `Ternary Plot of Top 3 Elements` }
    };
  };

  // 3D visualization data
  const prepare3DData = (): Data[] => {
    // Create a 3D scatter plot with random positions for elements
    // In a real application, you would use actual structural data
    return [{
      type: 'scatter3d' as const,
      mode: 'markers',
      x: processedData.map(() => Math.random() * 10),
      y: processedData.map(() => Math.random() * 10),
      z: processedData.map(() => Math.random() * 10),
      text: processedData.map(item => item.element),
      marker: {
        size: processedData.map(item => Math.max(item.percentage * 0.3, 5)),
        color: processedData.map(item => item.color),
        opacity: 0.8,
        symbol: 'circle'
      },
      hoverinfo: 'text'
    }];
  };

  // 3D visualization layout
  const get3DLayout = (): Partial<Layout> => {
    return {
      autosize: true,
      margin: { l: 0, r: 0, t: 50, b: 0 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      scene: {
        xaxis: { title: '', showticklabels: false },
        yaxis: { title: '', showticklabels: false },
        zaxis: { title: '', showticklabels: false },
        aspectmode: 'cube'
      },
      title: { text: '3D Element Visualization' }
    };
  };

  // Handle exporting the current chart as an image
  const handleExportImage = () => {
    // This functionality is built into Plotly's modebar
    // The user can click the camera icon to download the image
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="composition">Composition</TabsTrigger>
          <TabsTrigger value="ternary">Ternary Plot</TabsTrigger>
          <TabsTrigger value="3d">3D Visualization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="composition" className="w-full">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Advanced Batch Composition Visualization</CardTitle>
              <CardDescription>
                Interactive visualization of your batch composition using Plotly
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2">
                <Label htmlFor="chart-type">Chart Type:</Label>
                <Select value={chartType} onValueChange={(value) => setChartType(value as any)}>
                  <SelectTrigger id="chart-type" className="w-[180px]">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="radar">Radar Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                    <SelectItem value="heatmap">Heatmap</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={handleExportImage}>
                  Export as Image
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full">
                <Suspense fallback={<div className="flex items-center justify-center h-full"><p>Loading chart...</p></div>}>
                  <Plot
                    data={getPlotData()}
                    layout={getLayout()}
                    config={config}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ternary" className="w-full">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Ternary Phase Diagram</CardTitle>
              <CardDescription>
                Visualize relationships between the top three elements in your batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full">
                {prepareTernaryData() ? (
                  <Suspense fallback={<div className="flex items-center justify-center h-full"><p>Loading chart...</p></div>}>
                    <Plot
                      data={prepareTernaryData()}
                      layout={getTernaryLayout()}
                      config={config}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Suspense>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Not enough elements for ternary plot (minimum 3 required)</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="3d" className="w-full">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>3D Element Visualization</CardTitle>
              <CardDescription>
                Interactive 3D visualization of element distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full">
                <Suspense fallback={<div className="flex items-center justify-center h-full"><p>Loading 3D visualization...</p></div>}>
                  <Plot
                    data={prepare3DData()}
                    layout={get3DLayout()}
                    config={config}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlotlyVisualization;
"use client";

import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  color?: string;
  size?: number;
  properties: Record<string, number>;
}

interface PropertyMapProps {
  data: DataPoint[];
  availableProperties: string[];
  defaultXProperty?: string;
  defaultYProperty?: string;
}

const PropertyMap = ({ 
  data, 
  availableProperties,
  defaultXProperty = availableProperties[0] || '',
  defaultYProperty = availableProperties[1] || ''
}: PropertyMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xProperty, setXProperty] = useState(defaultXProperty);
  const [yProperty, setYProperty] = useState(defaultYProperty);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update data points based on selected properties
    const mappedData = data.map(point => ({
      ...point,
      x: point.properties[xProperty] || 0,
      y: point.properties[yProperty] || 0
    }));

    renderPropertyMap(ctx, canvas.width, canvas.height, mappedData);

    // Set up mouse move handler for tooltips
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Find if mouse is over any point
      const point = findPointAtPosition(mappedData, mouseX, mouseY, canvas.width, canvas.height);
      setHoveredPoint(point);

      // Redraw if hovering state changed
      if ((point && !hoveredPoint) || (!point && hoveredPoint) || 
          (point && hoveredPoint && point.id !== hoveredPoint.id)) {
        renderPropertyMap(ctx, canvas.width, canvas.height, mappedData);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [data, xProperty, yProperty, hoveredPoint]);

  const findPointAtPosition = (
    points: DataPoint[], 
    mouseX: number, 
    mouseY: number,
    width: number,
    height: number
  ): DataPoint | null => {
    // Calculate plot area dimensions
    const padding = 60;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Find min/max values for normalization
    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Check if mouse is over any point
    for (const point of points) {
      // Normalize coordinates to canvas
      const normalizedX = padding + ((point.x - xMin) / (xMax - xMin)) * plotWidth;
      const normalizedY = height - padding - ((point.y - yMin) / (yMax - yMin)) * plotHeight;
      
      const pointSize = point.size || 6;
      const distance = Math.sqrt(
        Math.pow(mouseX - normalizedX, 2) + 
        Math.pow(mouseY - normalizedY, 2)
      );

      if (distance <= pointSize + 2) {
        return point;
      }
    }

    return null;
  };

  const renderPropertyMap = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    mappedData: DataPoint[]
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up plot area dimensions
    const padding = 60;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Find min/max values for axes
    const xValues = mappedData.map(p => p.x);
    const yValues = mappedData.map(p => p.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Add some padding to the ranges
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const paddedXMin = xMin - xRange * 0.05;
    const paddedXMax = xMax + xRange * 0.05;
    const paddedYMin = yMin - yRange * 0.05;
    const paddedYMax = yMax + yRange * 0.05;

    // Draw axes
    drawAxes(ctx, width, height, padding, paddedXMin, paddedXMax, paddedYMin, paddedYMax, xProperty, yProperty);

    // Plot data points
    mappedData.forEach(point => {
      // Normalize coordinates to canvas
      const normalizedX = padding + ((point.x - paddedXMin) / (paddedXMax - paddedXMin)) * plotWidth;
      const normalizedY = height - padding - ((point.y - paddedYMin) / (paddedYMax - paddedYMin)) * plotHeight;

      // Draw point
      const pointSize = point.size || 6;
      const pointColor = point.color || '#3b82f6';

      ctx.beginPath();
      ctx.arc(normalizedX, normalizedY, pointSize, 0, Math.PI * 2);
      
      // Highlight hovered point
      if (hoveredPoint && point.id === hoveredPoint.id) {
        ctx.fillStyle = '#ff4500';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw tooltip
        drawTooltip(ctx, point, normalizedX, normalizedY);
      } else {
        ctx.fillStyle = pointColor;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw label if provided
      if (point.label) {
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(point.label, normalizedX, normalizedY - pointSize - 2);
      }
    });
  };

  const drawAxes = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: number,
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    xLabel: string,
    yLabel: string
  ) => {
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Draw axes lines
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;

    // X-axis grid lines and labels
    const xStep = calculateAxisStep(xMax - xMin);
    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const xPos = padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(xPos, height - padding);
      ctx.lineTo(xPos, padding);
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(x.toFixed(1), xPos, height - padding + 5);
    }

    // Y-axis grid lines and labels
    const yStep = calculateAxisStep(yMax - yMin);
    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const yPos = height - padding - ((y - yMin) / (yMax - yMin)) * plotHeight;
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding, yPos);
      ctx.lineTo(width - padding, yPos);
      ctx.stroke();
      
      // Label
      ctx.fillStyle = '#666';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(y.toFixed(1), padding - 5, yPos);
    }

    // Draw axis labels
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    
    // X-axis label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(xLabel, padding + plotWidth / 2, height - padding + 30);
    
    // Y-axis label
    ctx.save();
    ctx.translate(padding - 35, padding + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Draw title
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`${yLabel} vs ${xLabel}`, width / 2, 15);
  };

  const calculateAxisStep = (range: number): number => {
    const targetSteps = 5; // Aim for about 5-10 steps on each axis
    const magnitude = Math.pow(10, Math.floor(Math.log10(range / targetSteps)));
    
    // Try different step sizes
    const steps = [1, 2, 5, 10].map(step => step * magnitude);
    
    // Find the step size that gives closest to target number of steps
    return steps.reduce((prev, curr) => {
      const prevSteps = range / prev;
      const currSteps = range / curr;
      return Math.abs(currSteps - targetSteps) < Math.abs(prevSteps - targetSteps) ? curr : prev;
    });
  };

  const drawTooltip = (
    ctx: CanvasRenderingContext2D,
    point: DataPoint,
    x: number,
    y: number
  ) => {
    // Prepare tooltip content
    const lines = [
      point.label || `Point ${point.id}`,
      `${xProperty}: ${point.x.toFixed(2)}`,
      `${yProperty}: ${point.y.toFixed(2)}`
    ];
    
    // Add other properties
    Object.entries(point.properties)
      .filter(([key]) => key !== xProperty && key !== yProperty)
      .slice(0, 3) // Limit to 3 additional properties to avoid cluttering
      .forEach(([key, value]) => {
        lines.push(`${key}: ${value.toFixed(2)}`);
      });
    
    // Calculate tooltip dimensions
    ctx.font = '12px Arial';
    const lineHeight = 18;
    const padding = 8;
    const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    const tooltipWidth = maxWidth + padding * 2;
    const tooltipHeight = lines.length * lineHeight + padding * 2;
    
    // Position tooltip to avoid going off-screen
    let tooltipX = x + 15;
    let tooltipY = y - tooltipHeight - 10;
    
    if (tooltipY < 10) tooltipY = y + 15; // Show below if too high
    if (tooltipX + tooltipWidth > ctx.canvas.width - 10) tooltipX = x - tooltipWidth - 10; // Show left if too far right
    
    // Draw tooltip background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5);
    ctx.fill();
    ctx.stroke();
    
    // Draw tooltip text
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    lines.forEach((line, index) => {
      const lineY = tooltipY + padding + index * lineHeight;
      ctx.fillText(line, tooltipX + padding, lineY);
    });
  };

  return (
    <Card className="p-4 w-full h-full">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">X-Axis Property</label>
          <Select value={xProperty} onValueChange={setXProperty}>
            <SelectTrigger>
              <SelectValue placeholder="Select X-axis property" />
            </SelectTrigger>
            <SelectContent>
              {availableProperties.map(prop => (
                <SelectItem key={`x-${prop}`} value={prop}>{prop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Y-Axis Property</label>
          <Select value={yProperty} onValueChange={setYProperty}>
            <SelectTrigger>
              <SelectValue placeholder="Select Y-axis property" />
            </SelectTrigger>
            <SelectContent>
              {availableProperties.map(prop => (
                <SelectItem key={`y-${prop}`} value={prop}>{prop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500} 
        className="w-full h-full"
      />
    </Card>
  );
};

export default PropertyMap;
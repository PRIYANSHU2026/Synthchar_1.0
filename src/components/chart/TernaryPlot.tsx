import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface TernaryDataPoint {
  id: string;
  a: number; // First component (bottom left)
  b: number; // Second component (bottom right)
  c: number; // Third component (top)
  color?: string;
  label?: string;
  size?: number;
}

interface TernaryPlotProps {
  data: TernaryDataPoint[];
  labels: [string, string, string]; // Labels for the three corners
  gridLines?: number; // Number of grid lines (default: 10)
  showLabels?: boolean;
}

const TernaryPlot = ({ 
  data, 
  labels, 
  gridLines = 10, 
  showLabels = true 
}: TernaryPlotProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderTernaryPlot(ctx, canvas.width, canvas.height);
  }, [data, labels, gridLines, showLabels]);

  const renderTernaryPlot = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up triangle dimensions
    const padding = 50;
    const triangleHeight = height - 2 * padding;
    const triangleWidth = (triangleHeight * 2) / Math.sqrt(3);
    
    // Calculate triangle corners
    const topX = width / 2;
    const topY = padding;
    const leftX = topX - triangleWidth / 2;
    const leftY = topY + triangleHeight;
    const rightX = topX + triangleWidth / 2;
    const rightY = leftY;

    // Draw main triangle
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw grid lines
    drawGrid(ctx, topX, topY, leftX, leftY, rightX, rightY, gridLines);

    // Draw labels
    if (showLabels) {
      drawLabels(ctx, topX, topY, leftX, leftY, rightX, rightY, labels);
    }

    // Plot data points
    data.forEach(point => {
      // Normalize values to ensure they sum to 1
      const sum = point.a + point.b + point.c;
      const normA = point.a / sum;
      const normB = point.b / sum;
      const normC = point.c / sum;

      // Convert barycentric coordinates to Cartesian
      const x = leftX * normA + rightX * normB + topX * normC;
      const y = leftY * normA + rightY * normB + topY * normC;

      // Draw point
      const pointSize = point.size || 6;
      const pointColor = point.color || '#ff4500';

      ctx.beginPath();
      ctx.arc(x, y, pointSize, 0, Math.PI * 2);
      ctx.fillStyle = pointColor;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw label if provided
      if (point.label) {
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(point.label, x, y - pointSize - 2);
      }
    });

    // Draw legend
    drawLegend(ctx, width, data);
  };

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    topX: number,
    topY: number,
    leftX: number,
    leftY: number,
    rightX: number,
    rightY: number,
    lines: number
  ) => {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;

    // Draw grid lines parallel to each side
    for (let i = 1; i < lines; i++) {
      const ratio = i / lines;

      // Lines parallel to bottom (constant C)
      const bottomY = topY + (leftY - topY) * ratio;
      const bottomLeftX = topX - (topX - leftX) * ratio;
      const bottomRightX = topX + (rightX - topX) * ratio;

      ctx.beginPath();
      ctx.moveTo(bottomLeftX, bottomY);
      ctx.lineTo(bottomRightX, bottomY);
      ctx.stroke();

      // Lines parallel to left side (constant B)
      const leftRatio = 1 - ratio;
      const leftStartX = leftX + (rightX - leftX) * leftRatio;
      const leftStartY = leftY;
      const leftEndX = topX;
      const leftEndY = topY + (leftY - topY) * leftRatio;

      ctx.beginPath();
      ctx.moveTo(leftStartX, leftStartY);
      ctx.lineTo(leftEndX, leftEndY);
      ctx.stroke();

      // Lines parallel to right side (constant A)
      const rightRatio = 1 - ratio;
      const rightStartX = rightX - (rightX - leftX) * rightRatio;
      const rightStartY = rightY;
      const rightEndX = topX;
      const rightEndY = topY + (rightY - topY) * rightRatio;

      ctx.beginPath();
      ctx.moveTo(rightStartX, rightStartY);
      ctx.lineTo(rightEndX, rightEndY);
      ctx.stroke();

      // Add percentage labels on grid lines
      if (i % 2 === 0) {
        const percent = Math.round(ratio * 100);
        
        // Label for bottom line (C value)
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${percent}%`, bottomLeftX - 5, bottomY);
        
        // Label for left line (B value)
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percent}%`, leftStartX + 5, leftStartY - (leftStartY - leftEndY) / 2);
        
        // Label for right line (A value)
        ctx.textAlign = 'right';
        ctx.fillText(`${percent}%`, rightStartX - 5, rightStartY - (rightStartY - rightEndY) / 2);
      }
    }
  };

  const drawLabels = (
    ctx: CanvasRenderingContext2D,
    topX: number,
    topY: number,
    leftX: number,
    leftY: number,
    rightX: number,
    rightY: number,
    labels: [string, string, string]
  ) => {
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';

    // Top label (C)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(labels[2], topX, topY - 10);
    ctx.fillText('100%', topX, topY - 30);

    // Bottom left label (A)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(labels[0], leftX - 10, leftY);
    ctx.fillText('100%', leftX - 10, leftY + 20);

    // Bottom right label (B)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(labels[1], rightX + 10, rightY);
    ctx.fillText('100%', rightX + 10, rightY + 20);

    // Draw axis labels along the sides
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';

    // Left side (increasing B, decreasing A)
    const leftMidX = (leftX + topX) / 2;
    const leftMidY = (leftY + topY) / 2;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Increasing ${labels[1]} →`, leftMidX - 10, leftMidY);

    // Right side (increasing A, decreasing B)
    const rightMidX = (rightX + topX) / 2;
    const rightMidY = (rightY + topY) / 2;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`← Increasing ${labels[0]}`, rightMidX + 10, rightMidY);

    // Bottom side (increasing C)
    const bottomMidX = (leftX + rightX) / 2;
    const bottomMidY = leftY + 40;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Increasing ${labels[2]} ↑`, bottomMidX, bottomMidY);
  };

  const drawLegend = (
    ctx: CanvasRenderingContext2D,
    width: number,
    data: TernaryDataPoint[]
  ) => {
    // Only draw legend if we have labeled data points
    const labeledPoints = data.filter(point => point.label);
    if (labeledPoints.length === 0) return;

    const legendX = width - 150;
    let legendY = 30;
    const legendSpacing = 25;

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText('Legend:', legendX, legendY);
    legendY += 20;

    // Display unique data points by label
    const uniqueLabels = new Map<string, TernaryDataPoint>();
    labeledPoints.forEach(point => {
      if (point.label && !uniqueLabels.has(point.label)) {
        uniqueLabels.set(point.label, point);
      }
    });

    uniqueLabels.forEach((point, label) => {
      const color = point.color || '#ff4500';
      
      // Draw color circle
      ctx.beginPath();
      ctx.arc(legendX + 7, legendY - 4, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(label, legendX + 20, legendY);
      
      legendY += legendSpacing;
    });
  };

  return (
    <Card className="p-4 w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full"
      />
    </Card>
  );
};

export default TernaryPlot;
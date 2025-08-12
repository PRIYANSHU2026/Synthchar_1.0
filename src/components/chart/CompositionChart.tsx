"use client";

import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface CompositionChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  type: 'bar' | 'pie' | 'radar';
}

const CompositionChart = ({ data, type }: CompositionChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple rendering function for demonstration purposes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (type === 'bar') {
      renderBarChart(ctx, data, canvas.width, canvas.height);
    } else if (type === 'pie') {
      renderPieChart(ctx, data, canvas.width, canvas.height);
    } else if (type === 'radar') {
      renderRadarChart(ctx, data, canvas.width, canvas.height);
    }
  }, [data, type]);

  const renderBarChart = (
    ctx: CanvasRenderingContext2D,
    data: CompositionChartProps['data'],
    width: number,
    height: number
  ) => {
    const barWidth = width / data.length - 20;
    const maxValue = Math.max(...data.map(item => item.value));
    const scaleFactor = (height - 60) / maxValue;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.strokeStyle = '#666';
    ctx.stroke();

    // Draw bars
    data.forEach((item, index) => {
      const x = 50 + index * (barWidth + 20);
      const barHeight = item.value * scaleFactor;
      const y = height - 40 - barHeight;

      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, height - 20);

      // Draw value
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
    });
  };

  const renderPieChart = (
    ctx: CanvasRenderingContext2D,
    data: CompositionChartProps['data'],
    width: number,
    height: number
  ) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;

    let startAngle = 0;

    // Draw pie segments
    data.forEach(item => {
      const sliceAngle = (2 * Math.PI * item.value) / total;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      // Draw label line and text
      const midAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, labelX, labelY);

      startAngle += sliceAngle;
    });

    // Draw legend
    const legendX = width - 100;
    const legendY = 40;

    data.forEach((item, index) => {
      const y = legendY + index * 25;

      // Draw color box
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 15, 15);

      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.label}: ${item.value}`, legendX + 25, y + 7);
    });
  };

  const renderRadarChart = (
    ctx: CanvasRenderingContext2D,
    data: CompositionChartProps['data'],
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const angleStep = (2 * Math.PI) / data.length;

    // Draw axes
    data.forEach((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const axisEndX = centerX + Math.cos(angle) * radius;
      const axisEndY = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(axisEndX, axisEndY);
      ctx.strokeStyle = '#ccc';
      ctx.stroke();

      // Draw label
      const labelX = centerX + Math.cos(angle) * (radius + 15);
      const labelY = centerY + Math.sin(angle) * (radius + 15);

      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data[index].label, labelX, labelY);
    });

    // Draw concentric circles
    for (let i = 1; i <= 5; i++) {
      const circleRadius = (radius * i) / 5;

      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#eee';
      ctx.stroke();
    }

    // Draw data points and connect them
    const maxValue = Math.max(...data.map(item => item.value));
    const points: [number, number][] = [];

    data.forEach((item, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedValue = item.value / maxValue;
      const pointRadius = radius * normalizedValue;
      const pointX = centerX + Math.cos(angle) * pointRadius;
      const pointY = centerY + Math.sin(angle) * pointRadius;

      points.push([pointX, pointY]);
    });

    // Draw the radar shape
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.closePath();
    ctx.fillStyle = 'rgba(75, 192, 192, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(75, 192, 192, 1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points
    points.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(75, 192, 192, 1)';
      ctx.fill();
    });
  };

  return (
    <Card className="p-4 w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full h-full"
      />
    </Card>
  );
};

export default CompositionChart;
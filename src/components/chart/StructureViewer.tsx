"use client";

import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface Atom {
  element: string;
  x: number;
  y: number;
  z: number;
}

interface StructureViewerProps {
  atoms: Atom[];
  bondDistance: number;
  rotationSpeed?: number;
}

const elementColors: Record<string, string> = {
  O: '#ff0000', // Red
  Si: '#f0c8a0', // Beige
  Na: '#0000ff', // Blue
  Ca: '#00ff00', // Green
  Al: '#c0c0c0', // Silver
  B: '#ffb6c1',  // Pink
  P: '#ffa500',  // Orange
  K: '#800080',  // Purple
  Mg: '#228b22', // Forest Green
  Li: '#b22222', // Firebrick
  // Add more elements as needed
};

const elementRadii: Record<string, number> = {
  O: 0.6,
  Si: 1.0,
  Na: 1.2,
  Ca: 1.4,
  Al: 0.9,
  B: 0.7,
  P: 0.8,
  K: 1.5,
  Mg: 1.1,
  Li: 0.9,
  // Add more elements as needed
};

const StructureViewer = ({ atoms, bondDistance, rotationSpeed = 0.01 }: StructureViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up mouse event handlers for rotation
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      rotationRef.current.y += dx * 0.01;
      rotationRef.current.x += dy * 0.01;

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    const animate = () => {
      if (!isDraggingRef.current) {
        rotationRef.current.y += rotationSpeed;
      }

      renderStructure(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [atoms, bondDistance, rotationSpeed]);

  const renderStructure = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 40; // Scale factor for coordinates

    // Calculate rotation matrices
    const cosX = Math.cos(rotationRef.current.x);
    const sinX = Math.sin(rotationRef.current.x);
    const cosY = Math.cos(rotationRef.current.y);
    const sinY = Math.sin(rotationRef.current.y);

    // Transform atoms for rendering
    const transformedAtoms = atoms.map(atom => {
      // Apply rotation around X axis
      const y1 = atom.y * cosX - atom.z * sinX;
      const z1 = atom.y * sinX + atom.z * cosX;

      // Apply rotation around Y axis
      const x2 = atom.x * cosY + z1 * sinY;
      const z2 = -atom.x * sinY + z1 * cosY;

      return {
        ...atom,
        x2,
        y2: y1,
        z2,
        screenX: centerX + x2 * scale,
        screenY: centerY + y1 * scale,
        screenZ: z2, // Used for depth sorting
      };
    });

    // Sort atoms by z-coordinate for proper depth rendering
    transformedAtoms.sort((a, b) => b.z2 - a.z2);

    // Draw bonds first
    for (let i = 0; i < transformedAtoms.length; i++) {
      const atom1 = transformedAtoms[i];
      
      for (let j = i + 1; j < transformedAtoms.length; j++) {
        const atom2 = transformedAtoms[j];
        
        // Calculate 3D distance between atoms
        const dx = atom1.x - atom2.x;
        const dy = atom1.y - atom2.y;
        const dz = atom1.z - atom2.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Draw bond if atoms are close enough
        if (distance <= bondDistance) {
          const opacity = Math.max(0.2, 1 - Math.min(atom1.z2, atom2.z2) * 0.1);
          
          ctx.beginPath();
          ctx.moveTo(atom1.screenX, atom1.screenY);
          ctx.lineTo(atom2.screenX, atom2.screenY);
          ctx.strokeStyle = `rgba(150, 150, 150, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }

    // Draw atoms
    transformedAtoms.forEach(atom => {
      const radius = (elementRadii[atom.element] || 0.8) * scale / 2;
      const color = elementColors[atom.element] || '#888888';
      const opacity = Math.max(0.4, 1 - atom.z2 * 0.1);
      
      // Draw atom as circle
      ctx.beginPath();
      ctx.arc(atom.screenX, atom.screenY, radius, 0, Math.PI * 2);
      
      // Create gradient for 3D effect
      const gradient = ctx.createRadialGradient(
        atom.screenX - radius / 3, 
        atom.screenY - radius / 3, 
        0,
        atom.screenX, 
        atom.screenY, 
        radius
      );
      
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(1, `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw element label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(atom.element, atom.screenX, atom.screenY);
    });

    // Draw legend
    const legendX = 20;
    let legendY = 30;
    const legendSpacing = 25;

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText('Elements:', legendX, legendY);
    legendY += 20;

    // Display elements present in the structure
    const elementsInStructure = [...new Set(atoms.map(atom => atom.element))];
    
    elementsInStructure.forEach(element => {
      const color = elementColors[element] || '#888888';
      
      // Draw color box
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY - 10, 15, 15);
      
      // Draw element name
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.fillText(element, legendX + 25, legendY);
      
      legendY += legendSpacing;
    });

    // Instructions
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.fillText('Drag to rotate, or watch auto-rotation', legendX, height - 20);
  };

  return (
    <Card className="p-4 w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500} 
        className="w-full h-full cursor-move"
      />
    </Card>
  );
};

export default StructureViewer;
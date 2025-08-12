
"use client"

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { RefreshCcw } from 'lucide-react';

interface DrawPadProps {
  onPatternComplete: (pattern: number[]) => void;
  className?: string;
}

export function DrawPad({ onPatternComplete, className }: DrawPadProps) {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleNodeInteraction = (index: number) => {
    if (!activeNodes.includes(index)) {
      setActiveNodes(prev => [...prev, index]);
    }
  };

  const handleMouseDown = (index: number) => {
    setIsDrawing(true);
    handleNodeInteraction(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isDrawing) {
      handleNodeInteraction(index);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
        setIsDrawing(false);
        onPatternComplete(activeNodes);
    }
  };

  const handleReset = () => {
    setActiveNodes([]);
    onPatternComplete([]);
  }

  // Add event listener to the window to catch mouseup even if it's outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
        if(isDrawing) {
            handleMouseUp();
        }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDrawing, activeNodes, onPatternComplete]);

  return (
    <div className={cn("bg-secondary/50 p-4 rounded-lg", className)}>
        <div 
            ref={gridRef}
            className="grid grid-cols-3 gap-6 select-none relative" 
            onMouseLeave={handleMouseUp}
        >
            {[...Array(9)].map((_, i) => (
                <div
                    key={i}
                    className="flex justify-center items-center"
                    onMouseDown={() => handleMouseDown(i)}
                    onMouseEnter={() => handleMouseEnter(i)}
                >
                    <div className={cn(
                        "w-4 h-4 rounded-full bg-muted transition-all",
                        activeNodes.includes(i) && "bg-primary scale-150"
                    )}/>
                </div>
            ))}
        </div>
        <Button onClick={handleReset} variant="ghost" size="sm" className="w-full mt-4">
            <RefreshCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
    </div>
  );
}

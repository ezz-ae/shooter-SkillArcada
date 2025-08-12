
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const MAZE_GRID = [
  [1, 0, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1],
];

const MAZE_SOLUTION = "0-1,1-1,2-1,3-1,3-2,3-3,2-3,1-3,1-4,1-5,2-5,3-5,4-5";

interface MazeGameProps {
  onComplete: () => void;
  className?: string;
  isGameActive: boolean;
}

export function MazeGame({ onComplete, className, isGameActive }: MazeGameProps) {
  const [path, setPath] = useState<string[]>(['0-0']); // Start at the beginning
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleInteraction = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    if (!isGameActive || MAZE_GRID[row]?.[col] !== 0) return;

    const lastCell = path[path.length - 1];
    if (path.includes(cellKey)) {
        // Allow moving back
        if (path.length > 1 && path[path.length-2] === cellKey) {
             setPath(prev => prev.slice(0, -1));
        }
        return;
    }

    const [lastRow, lastCol] = lastCell.split('-').map(Number);
    const isAdjacent = Math.abs(lastRow - row) + Math.abs(lastCol - col) === 1;

    if (isAdjacent) {
      setPath(prev => [...prev, cellKey]);
    }
  };

  const handleMouseDown = (row: number, col: number) => {
    if (MAZE_GRID[row]?.[col] === 0) {
      setIsDrawing(true);
      handleInteraction(row, col);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      handleInteraction(row, col);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    if (path.join(',') === MAZE_SOLUTION) {
      onComplete();
    }
  }, [path, onComplete]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDrawing) handleMouseUp();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDrawing]);
  
   useEffect(() => {
    if (!isGameActive) {
      setPath(['0-0']);
      setIsDrawing(false);
    }
  }, [isGameActive]);

  return (
    <div
      ref={gridRef}
      className={cn("grid bg-secondary p-2 rounded-lg gap-1 select-none", className)}
      style={{ gridTemplateColumns: `repeat(${MAZE_GRID[0].length}, 1fr)` }}
      onMouseLeave={handleMouseUp}
    >
      {MAZE_GRID.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const cellKey = `${rowIndex}-${colIndex}`;
          const isStart = rowIndex === 0 && colIndex === 0;
          const isEnd = rowIndex === 4 && colIndex === 6;
          const isInPath = path.includes(cellKey);
          
          return (
            <div
              key={cellKey}
              className={cn(
                "aspect-square flex items-center justify-center text-xs font-bold transition-colors",
                cell === 1 ? 'bg-muted-foreground/50' : 'bg-background hover:bg-secondary-foreground/20',
                isInPath && 'bg-primary/80',
                isStart && 'bg-green-500',
                isEnd && 'bg-red-500',
                !isGameActive && 'opacity-60 cursor-not-allowed',
                isGameActive && cell === 0 && 'cursor-pointer',
              )}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            >
              {isStart && 'S'}
              {isEnd && 'E'}
            </div>
          );
        })
      )}
    </div>
  );
}

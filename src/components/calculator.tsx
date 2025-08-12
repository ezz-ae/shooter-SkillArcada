
"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface CalculatorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function Calculator({ value, onValueChange, className }: CalculatorProps) {
  const handleNumberClick = (num: string) => {
    onValueChange(value + num);
  };

  const handleClear = () => {
    onValueChange("");
  };

  const handleDelete = () => {
    onValueChange(value.slice(0, -1));
  }

  const buttons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    'C', '0', 'DEL'
  ];

  return (
    <div className={cn("bg-secondary p-2 rounded-lg", className)}>
      <div className="bg-background h-10 rounded-md mb-2 flex items-center justify-end px-2 text-2xl font-mono text-right">
        {value || '0'}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {buttons.map((btn) => (
          <Button
            key={btn}
            variant={btn === 'C' || btn === 'DEL' ? 'destructive' : 'outline'}
            className="h-10 text-xl font-bold"
            onClick={() => {
              if (btn === 'C') {
                handleClear();
              } else if (btn === 'DEL') {
                handleDelete();
              } else {
                handleNumberClick(btn);
              }
            }}
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  );
}

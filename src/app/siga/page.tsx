
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, Grid } from "lucide-react";
import { useState } from "react";

const SigaBoard = ({ onMove, boardState, selectedPiece, onSelectPiece, winningMove, isWon }: { onMove: (from: [number, number], to: [number, number]) => void, boardState: (string|null)[][], selectedPiece: [number, number] | null, onSelectPiece: (pos: [number, number]) => void, winningMove: any, isWon: boolean }) => {

    const handleSquareClick = (row: number, col: number) => {
        if (isWon) return;
        const piece = boardState[row][col];
        if (selectedPiece) {
            onMove(selectedPiece, [row, col]);
        } else if (piece) {
            onSelectPiece([row, col]);
        }
    }
    
    return (
        <div className="grid grid-cols-5 gap-1 p-2 bg-secondary rounded-lg aspect-square max-w-sm mx-auto shadow-inner">
            {boardState.map((row, rowIndex) => (
                row.map((piece, colIndex) => {
                    const isWinningMove = isWon && ((rowIndex === winningMove.from[0] && colIndex === winningMove.from[1]) || (rowIndex === winningMove.to[0] && colIndex === winningMove.to[1]));
                    return (
                        <div 
                            key={`${rowIndex}-${colIndex}`}
                            className={cn(
                                "aspect-square rounded-md flex items-center justify-center cursor-pointer transition-colors",
                                "bg-background hover:bg-secondary-foreground/20"
                            )}
                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                        >
                            {piece && (
                                <div className={cn("w-3/4 h-3/4 rounded-full transition-all duration-300 shadow-md",
                                    piece === 'p1' ? 'bg-primary' : 'bg-accent',
                                    selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex && "ring-4 ring-offset-2 ring-offset-background ring-foreground",
                                    isWinningMove && "animate-pulse"
                                )} />
                            )}
                        </div>
                    )
                })
            ))}
        </div>
    )
}


export default function SigaPage() {
    const initialBoard: (string|null)[][] = [
        [null, 'p1', null, 'p1', null],
        ['p2', null, 'p2', null, 'p2'],
        [null, 'p1', null, 'p1', null],
        ['p2', null, 'p2', null, 'p2'],
        [null, null, null, null, null],
    ];
    
    const { toast } = useToast();
    const { addShots } = useStore();

    const [board, setBoard] = useState(initialBoard);
    const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
    const [isWon, setIsWon] = useState(false);
    
    const winningMove = { from: [1, 2], to: [0, 2] };

    const handleSelect = (pos: [number, number]) => {
        if (isWon) return;
        if (board[pos[0]][pos[1]] === 'p2') { // Player 2's pieces
            setSelectedPiece(pos);
        } else {
            toast({ variant: "destructive", title: "Not your piece!", description: "You can only move the orange pieces." });
        }
    }
    
    const handleMove = (from: [number, number], to: [number, number]) => {
        if (isWon) return;
        if (from[0] === winningMove.from[0] && from[1] === winningMove.from[1] &&
            to[0] === winningMove.to[0] && to[1] === winningMove.to[1]) {
            
            const newBoard = board.map(row => [...row]);
            newBoard[to[0]][to[1]] = newBoard[from[0]][from[1]];
            newBoard[from[0]][from[1]] = null;
            newBoard[0][1] = null; // Capture opponent piece

            setBoard(newBoard);
            setIsWon(true);
            addShots(25);
            toast({
                title: "Brilliant Move!",
                description: "You've captured and won the puzzle! 25 Shots awarded.",
            })
        } else {
            toast({ variant: "destructive", title: "Not the winning move!", description: "There's a better move on the board." });
        }
        setSelectedPiece(null);
    }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-2">
            <Grid /> Siga Strategy Puzzle
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          A traditional two-player strategy board game from the Philippines. Find the winning move for orange.
        </p>
      </div>

      <Card className="w-full max-w-md text-center p-4">
        <CardHeader>
          <CardTitle>Capture to Win</CardTitle>
          <CardDescription>Move one of your pieces to capture an opponent's piece and secure the win.</CardDescription>
        </CardHeader>
        <CardContent>
            <SigaBoard 
                boardState={board}
                selectedPiece={selectedPiece}
                onSelectPiece={handleSelect}
                onMove={handleMove}
                winningMove={winningMove}
                isWon={isWon}
            />
        </CardContent>
         {isWon && (
             <div className="mt-4 p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 font-bold flex items-center justify-center gap-2">
                <Check /> Puzzle Solved! Prize Awarded.
            </div>
        )}
      </Card>
    </div>
  );
}


"use client"

import { cn } from '@/lib/utils';
import { useState } from 'react';

type PieceType = 'King' | 'Queen' | 'Rook' | 'Bishop' | 'Knight' | 'Pawn';
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface ChessBoardProps {
  initialBoard?: (Piece | null)[][];
  onMove: (from: [number, number], to: [number, number]) => void;
  isWhiteTurn?: boolean;
  className?: string;
}

const defaultBoard: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

const PieceIcon = ({ piece }: { piece: Piece }) => (
    <div className={cn("flex flex-col items-center justify-center h-full w-full", piece.color === 'white' ? 'text-gray-800' : 'text-white')}>
        <svg viewBox="0 0 100 100" className="h-2/3 w-2/3" fill="currentColor">
             <path d="M50 10 C 40 25, 40 50, 50 60 C 60 50, 60 25, 50 10 Z" />
             <rect x="40" y="55" width="20" height="25" />
             <rect x="30" y="80" width="40" height="10" />
        </svg>
        <span className="text-[8px] md:text-[10px] font-bold mt-[-4px] select-none">{piece.type}</span>
    </div>
);


export function ChessBoard({ initialBoard = defaultBoard, onMove, isWhiteTurn = true, className }: ChessBoardProps) {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);

  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      const [fromRow, fromCol] = selectedPiece;
      if (fromRow === row && fromCol === col) {
        setSelectedPiece(null); // Deselect
        return;
      }
      onMove([fromRow, fromCol], [row, col]);
      setSelectedPiece(null);
    } else {
      const piece = board[row][col];
      if (piece && (isWhiteTurn ? piece.color === 'white' : piece.color === 'black')) {
        setSelectedPiece([row, col]);
      }
    }
  };

  return (
    <div className={cn("aspect-square w-full grid grid-cols-8 bg-[#eeeed2] border-4 border-[#769656]", className)}>
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isLightSquare = (rowIndex + colIndex) % 2 !== 0;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-full h-full flex items-center justify-center relative",
                isLightSquare ? 'bg-[#eeeed2]' : 'bg-[#769656]',
                'cursor-pointer'
              )}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {piece && <PieceIcon piece={piece} />}
              {selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex && (
                 <div className="absolute inset-0 bg-yellow-500/50" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

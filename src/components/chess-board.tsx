
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

// Using text for pieces for better visual representation
const pieceUnicode: { [key in PieceColor]: { [key in PieceType]: string } } = {
  white: { King: '♔', Queen: '♕', Rook: '♖', Bishop: '♗', Knight: '♘', Pawn: '♙' },
  black: { King: '♚', Queen: '♛', Rook: '♜', Bishop: '♝', Knight: '♞', Pawn: '♟︎' },
};

const PieceIcon = ({ piece }: { piece: Piece }) => (
    <span className={cn("text-4xl md:text-5xl", piece.color === 'white' ? 'text-stone-100' : 'text-stone-800')}>
        {pieceUnicode[piece.color][piece.type]}
    </span>
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
    <div className={cn("aspect-square w-full grid grid-cols-8 border-4 shadow-lg border-[#769656]", className)}>
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isLightSquare = (rowIndex + colIndex) % 2 !== 0;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-full h-full flex items-center justify-center relative",
                isLightSquare ? 'bg-[#eeeed2]' : 'bg-[#769656]',
                'cursor-pointer transition-colors'
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

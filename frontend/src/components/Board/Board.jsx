import {useRef, useState, useLayoutEffect} from "react";
import PieceLayer from "./PieceLayer";
import ArrowLayer from "./ArrowLayer";
import SquareLayer from "./SquareLayer";

// ✅ Helper to map board indices to algebraic notation
function squareFromIndex(row, col, isFlipped) {
  if (!isFlipped) {
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  }

  // ✅ Flip mapping
  const flippedRow = 7 - row;
  const flippedCol = 7 - col;
  const file = String.fromCharCode(97 + flippedCol);
  const rank = 8 - flippedRow;
  return `${file}${rank}`;
}

const Board = ({
  board,
  selectedSquare,
  legalMoves,
  lastMove,
  bestMove,
  isFlipped,
  onSquareClick,
  onDragStart,
  onDragMove,
  onDragEnd,
  turn,
}) => {
  const boardRef = useRef(null);

  // ✅ Determine correct board orientation
  const displayBoard = isFlipped ? [...board].reverse() : board;

  return (
    <div
  id="chess-board"
  ref={boardRef}
  className="relative aspect-square rounded-xl overflow-hidden shadow-xl select-none"
  onPointerMove={onDragMove}
  onPointerUp={onDragEnd}
>
      {/* ✅ Board Squares Only */}
      {displayBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="flex" style={{ height: "12.5%" }}>
          {(isFlipped ? [...row].reverse() : row).map((piece, colIndex) => {
            const square = squareFromIndex(rowIndex, colIndex, isFlipped);

            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegal = legalMoves.includes(square);
            const isLastFrom = lastMove && square === lastMove.from;
            const isLastTo = lastMove && square === lastMove.to;

            return (
              <div
                key={colIndex}
                onClick={() => onSquareClick(row, colIndex)}
                onPointerDown={(e) => onDragStart(e, rowIndex, colIndex, piece)}
                className={`
                  flex items-center justify-center transition-all
                  ${isLight ? "bg-[#EEEED2]" : "bg-[#769656]"}
                  ${isSelected ? "ring-4 ring-blue-400 ring-inset" : ""}
                  ${isLegal ? "ring-4 ring-yellow-300 ring-inset" : ""}
                  ${isLastFrom || isLastTo ? "ring-4 ring-yellow-500 bg-yellow-400/70 ring-inset" : ""}
                `}
                style={{ width: "12.5%" }}
              />
            );
          })}
        </div>
      ))}

      {/* ✅ Squares */}
      <SquareLayer
        board={board}
        selectedSquare={selectedSquare}
        legalMoves={legalMoves}
        lastMove={lastMove}
        isFlipped={isFlipped}
        onSquareClick={onSquareClick}
        onPointerDown={onDragStart}
      />

      {/* ✅ Piece Layer (completely independent) */}
      <PieceLayer
        board={board}
        isFlipped={isFlipped}
        selectedSquare={selectedSquare}
        draggingPieceRef={boardRef}
        onDragStart={onDragStart}
        turn={turn}
      />

      {/* ✅ Arrow Layer */}
      <ArrowLayer bestMove={bestMove} isFlipped={isFlipped} />
    </div>
  );
};

export default Board;

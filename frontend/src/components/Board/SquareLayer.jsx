import React from "react";

function squareFromIndex(row, col, isFlipped) {
  if (!isFlipped) {
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  }

  // ✅ Flip coordinates
  const flippedRow = 7 - row;
  const flippedCol = 7 - col;
  const file = String.fromCharCode(97 + flippedCol);
  const rank = 8 - flippedRow;
  return `${file}${rank}`;
}

const SquareLayer = ({
  board,
  selectedSquare,
  legalMoves,
  lastMove,
  isFlipped,
  onSquareClick,
  onPointerDown,
}) => {
  return (
    <>
      {(isFlipped ? [...board].reverse() : board).map((row, rowIndex) => (
        <div key={rowIndex} className="flex" style={{ height: "12.5%" }}>
          {(isFlipped ? [...row].reverse() : row).map((_, colIndex) => {
            const square = squareFromIndex(rowIndex, colIndex, isFlipped);
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegal = legalMoves.includes(square);
            const isLastFrom = lastMove && square === lastMove.from;
            const isLastTo = lastMove && square === lastMove.to;

            return (
              <div
                key={colIndex}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                onPointerDown={(e) =>
                  onPointerDown(e, rowIndex, colIndex, square)
                }
                className={`
                  flex items-center justify-center cursor-pointer transition-all
                  ${isLight ? "bg-[#EEEED2]" : "bg-[#769656]"}
                  ${isSelected ? "ring-4 ring-blue-400 ring-inset" : ""}
                  ${isLegal ? "ring-4 ring-yellow-300 ring-inset" : ""}
                  ${
                    isLastFrom || isLastTo
                      ? "ring-4 ring-yellow-400 bg-yellow-400/80 ring-inset"
                      : ""
                  }
                  hover:brightness-95
                `}
                style={{ width: "12.5%" }}
              />
            );
          })}
        </div>
      ))}
    </>
  );
};

export default SquareLayer;

// src/components/Board.jsx
import React, { useRef, useState } from "react";

function squareFromIndex(row, col) {
  const file = String.fromCharCode(97 + col); // a-h
  const rank = 8 - row; // 8-1
  return `${file}${rank}`;
}

// Convert algebraic square → view row/col (for arrow drawing)
function squareToViewCoords(square, isFlipped) {
  const file = square.charCodeAt(0) - 97; // 0-7
  const rank = parseInt(square[1], 10);   // 1-8
  const modelRow = 8 - rank;              // 0-7
  const modelCol = file;                  // 0-7

  if (!isFlipped) {
    return { row: modelRow, col: modelCol };
  }

  return {
    row: 7 - modelRow,
    col: 7 - modelCol,
  };
}

function getPieceImage(piece) {
  if (!piece) return null;
  const color = piece === piece.toUpperCase() ? "w" : "b";
  const type = piece.toUpperCase();
  return `/pieces/${color}${type}.svg`;
}

const Board = ({
  board,            // 8x8 array of 'p','P',null
  selectedSquare,   // "e2"
  legalMoves,       // ["e4","e3"...]
  lastMove,         // { from: "e2", to: "e4", ... } or null
  bestMove,         // "e2e4" or null
  isFlipped,
  onSquareClick,    // (square) => void
  onDragEnd,        // (from, to) => void
}) => {
  const boardRef = useRef(null);
  const [draggingPiece, setDraggingPiece] = useState(null); // 'P','p'
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragFrom, setDragFrom] = useState(null);           // "e2"

  const handlePointerDown = (e, viewRow, viewCol, piece) => {
    if (!piece) return;

    const rect = boardRef.current.getBoundingClientRect();

    // Convert view indices (UI) → model indices (board array)
    const modelRow = isFlipped ? 7 - viewRow : viewRow;
    const modelCol = isFlipped ? 7 - viewCol : viewCol;
    const square = squareFromIndex(modelRow, modelCol);

    setDragPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setDraggingPiece(piece);
    setDragFrom(square);

    // Prevent text selection / weird native drag
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!draggingPiece) return;
    const rect = boardRef.current.getBoundingClientRect();

    setDragPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerUp = (e) => {
    if (!draggingPiece) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const squareSize = rect.width / 8;

    let viewCol = Math.floor(x / squareSize);
    let viewRow = Math.floor(y / squareSize);

    if (viewCol < 0 || viewCol > 7 || viewRow < 0 || viewRow > 7) {
      setDraggingPiece(null);
      setDragFrom(null);
      return;
    }

    // view → model
    const modelRow = isFlipped ? 7 - viewRow : viewRow;
    const modelCol = isFlipped ? 7 - viewCol : viewCol;
    const dropSquare = squareFromIndex(modelRow, modelCol);

    if (dragFrom && dropSquare && onDragEnd) {
      onDragEnd(dragFrom, dropSquare);
    }

    setDraggingPiece(null);
    setDragFrom(null);
  };

  const handleSquareClickInternal = (viewRow, viewCol) => {
    const modelRow = isFlipped ? 7 - viewRow : viewRow;
    const modelCol = isFlipped ? 7 - viewCol : viewCol;
    const square = squareFromIndex(modelRow, modelCol);
    onSquareClick && onSquareClick(square);
  };

  return (
    <div
      ref={boardRef}
      className="relative aspect-square rounded-xl overflow-hidden shadow-xl"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Board grid */}
      {Array.from({ length: 8 }).map((_, viewRow) => {
        const modelRow = isFlipped ? 7 - viewRow : viewRow;
        const rowData = board[modelRow];

        return (
          <div key={viewRow} className="flex" style={{ height: "12.5%" }}>
            {Array.from({ length: 8 }).map((__, viewCol) => {
              const modelCol = isFlipped ? 7 - viewCol : viewCol;
              const piece = rowData[modelCol];
              const square = squareFromIndex(modelRow, modelCol);

              const isLight = (viewRow + viewCol) % 2 === 0;
              const isSelected = selectedSquare === square;
              const isLegal = legalMoves.includes(square);
              const isLastFrom = lastMove && square === lastMove.from;
              const isLastTo = lastMove && square === lastMove.to;

              return (
                <div
                  key={viewCol}
                  onClick={() => handleSquareClickInternal(viewRow, viewCol)}
                  onPointerDown={(e) =>
                    handlePointerDown(e, viewRow, viewCol, piece)
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
                >
                  {piece && (
                    <img
                      src={getPieceImage(piece)}
                      alt={piece}
                      className="w-14 h-14 select-none pointer-events-none"
                      style={{
                        opacity:
                          draggingPiece === piece && dragFrom === square
                            ? 0
                            : 1,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Dragging piece following cursor */}
      {draggingPiece && (
        <img
          src={getPieceImage(draggingPiece)}
          alt=""
          className="w-14 h-14 pointer-events-none absolute"
          style={{
            left: dragPos.x - 32,
            top: dragPos.y - 32,
            zIndex: 50,
            transition: "none",
          }}
        />
      )}

      {/* Best move arrow */}
      {bestMove && bestMove.length >= 4 && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {(() => {
            const from = bestMove.slice(0, 2);
            const to = bestMove.slice(2, 4);

            const fromPos = squareToViewCoords(from, isFlipped);
            const toPos = squareToViewCoords(to, isFlipped);

            const squareSize = 100 / 8;

            const x1 = (fromPos.col + 0.5) * squareSize + "%";
            const y1 = (fromPos.row + 0.5) * squareSize + "%";
            const x2 = (toPos.col + 0.5) * squareSize + "%";
            const y2 = (toPos.row + 0.5) * squareSize + "%";

            return (
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(0, 200, 0, 0.9)"
                strokeWidth="5"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
              />
            );
          })()}

          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="2"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 4 2, 0 4" fill="rgba(0, 200, 0, 0.9)" />
            </marker>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default Board;

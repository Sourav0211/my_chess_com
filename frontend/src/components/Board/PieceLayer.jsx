import React, { useState, useEffect } from "react";

function getPieceImage(piece) {
  if (!piece) return null;
  const color = piece === piece.toUpperCase() ? "w" : "b";
  const type = piece.toUpperCase();
  return `/pieces/${color}${type}.svg`;
}

const PieceLayer = ({
  board,
  isFlipped,
  selectedSquare,
  draggingPiece,
  dragPos,
  onDragStart,
  turn,
}) => {
  const [boardSize, setBoardSize] = useState(0);

  useEffect(() => {
    const el = document.getElementById("chess-board");
    if (el) setBoardSize(el.offsetWidth);
  }, []);

  const squareSize = boardSize / 8;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {(isFlipped ? [...board].reverse() : board).map((row, rowIdx) =>
        (isFlipped ? [...row].reverse() : row).map((piece, colIdx) => {
          if (!piece) return null;

          const x = colIdx * squareSize;
          const y = rowIdx * squareSize;

          const square = `${String.fromCharCode(97 + colIdx)}${8 - rowIdx}`;

          const isHidden =
            draggingPiece &&
            draggingPiece.square === square;

          return (
            <img
              key={square}
              src={getPieceImage(piece)}
              alt=""
              className="absolute w-14 h-14 select-none pointer-events-auto"
              style={{
                left: x + squareSize / 2 - 28,
                top: y + squareSize / 2 - 28,
                opacity: isHidden ? 0 : 1,
              }}
              onPointerDown={(e) =>
                onDragStart(e, rowIdx, colIdx, piece, square)
              }
            />
          );
        })
      )}

      {/* ✅ Dragging Piece */}
      {draggingPiece && (
        <img
          src={getPieceImage(draggingPiece.piece)}
          alt=""
          className="absolute w-14 h-14 pointer-events-none"
          style={{
            left: dragPos.x - 28,
            top: dragPos.y - 28,
          }}
        />
      )}
    </div>
  );
};

export default PieceLayer;

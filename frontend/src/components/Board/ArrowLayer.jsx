import React from "react";

// Convert algebraic ("e2") → row/col
function squareToCoords(square) {
  const file = square.charCodeAt(0) - 97; // a=0
  const rank = 8 - parseInt(square[1]);  // 8→0
  return { row: rank, col: file };
}

const ArrowLayer = ({ bestMove, isFlipped }) => {
  if (!bestMove) return null;

  // Extract "from" and "to" (e.g. "e2e4")
  const from = bestMove.slice(0, 2);
  const to = bestMove.slice(2, 4);

  const fromPos = squareToCoords(from);
  const toPos = squareToCoords(to);

  // Handle flipped board
  const start = {
    row: isFlipped ? 7 - fromPos.row : fromPos.row,
    col: isFlipped ? 7 - fromPos.col : fromPos.col,
  };

  const end = {
    row: isFlipped ? 7 - toPos.row : toPos.row,
    col: isFlipped ? 7 - toPos.col : toPos.col,
  };

  const squareSize = 100 / 8;

  const x1 = (start.col + 0.5) * squareSize + "%";
  const y1 = (start.row + 0.5) * squareSize + "%";
  const x2 = (end.col + 0.5) * squareSize + "%";
  const y2 = (end.row + 0.5) * squareSize + "%";

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
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
    </svg>
  );
};

export default ArrowLayer;

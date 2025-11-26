import React from "react";

// Temporary helper (same pattern as Board)
function getPieceImage(piece, isWhite) {
  const color = isWhite ? "w" : "b";
  const type = piece.toUpperCase();
  return `/pieces/${color}${type}.svg`;
}

const CapturedPieces = ({ capturedWhite, capturedBlack }) => {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 space-y-4">
      <h2 className="text-lg font-bold text-white">Captured Pieces</h2>

      {/* Black pieces captured by White */}
      <div>
        <div className="text-gray-400 text-sm mb-1">Black</div>
        <div className="flex flex-wrap gap-2">
          {capturedBlack.length === 0 ? (
            <span className="text-gray-500 text-xs">None</span>
          ) : (
            capturedBlack.map((p, i) => (
              <img
                key={i}
                src={getPieceImage(p, false)}
                alt={p}
                className="w-6 h-6"
              />
            ))
          )}
        </div>
      </div>

      {/* White pieces captured by Black */}
      <div>
        <div className="text-gray-400 text-sm mb-1">White</div>
        <div className="flex flex-wrap gap-2">
          {capturedWhite.length === 0 ? (
            <span className="text-gray-500 text-xs">None</span>
          ) : (
            capturedWhite.map((p, i) => (
              <img
                key={i}
                src={getPieceImage(p, true)}
                alt={p}
                className="w-6 h-6"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CapturedPieces;

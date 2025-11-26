import React from "react";
import { Zap, AlertCircle } from "lucide-react";

const EvalPanel = ({ analysis, isAnalyzing, error, turn }) => {

  // --- Normalize score to WHITE'S perspective ---
  let displayScore = 0;       // in centipawns, from White's POV
  let hasScore = false;

  if (analysis && analysis.scoreCp !== null && analysis.scoreCp !== undefined) {
    // Raw engine score: advantage for SIDE TO MOVE
    const raw = analysis.scoreCp;

    // If it's Black to move, flip it so that:
    //   + = White better, - = Black better
    displayScore = turn === "w" ? raw : -raw;
    hasScore = true;
  }

  // Mate normalization (optional, simple version)
  let mateForWhite = null;
  if (analysis && analysis.mate !== null && analysis.mate !== undefined) {
    mateForWhite = turn === "w" ? analysis.mate : -analysis.mate;
  }

  // --- Compute bar percentage from normalized score ---
  // 50 = equal, 100 = huge White advantage, 0 = huge Black advantage
  let computedPercent = 50;
  if (hasScore) {
    computedPercent = Math.min(
      100,
      Math.max(0, 50 + displayScore / 20) // scale factor tweakable
    );
  } else if (mateForWhite !== null) {
    computedPercent = mateForWhite > 0 ? 100 : 0;
  }

  const formattedScore =
    mateForWhite !== null
      ? `M${Math.abs(mateForWhite)}`
      : hasScore
      ? (displayScore / 100).toFixed(2)
      : "0.00";

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-yellow-400" size={24} />
        <h2 className="text-xl font-bold text-white">Evaluation</h2>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg mb-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Score + depth */}
      {analysis && (
        <div className="text-center mb-4">
          <div className="text-6xl font-bold text-white">
            {formattedScore}
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Depth: {analysis.depth ?? "-"}
          </div>
          {/* {isAnalyzing && (
            <div className="text-xs text-gray-400 mt-1 animate-pulse">
              Engine thinking...
            </div>
          )} */}
        </div>
      )}

      {/* Eval bar (Black ↔ White) */}
      {analysis && (
        <div className="mt-2">
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden flex">
            {/* Black side */}
            <div
              className="transition-all duration-300 ease-out bg-black"
              style={{ width: `${100 - computedPercent}%` }}
            />
            {/* White side */}
            <div
              className="transition-all duration-300 ease-out bg-white"
              style={{ width: `${computedPercent}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Black</span>
            <span>White</span>
          </div>
        </div>
      )}

      {/* Before first eval */}
      {!analysis && !error && (
        <div className="text-gray-400 text-center py-6 text-sm">
          Make a move to begin evaluation
        </div>
      )}
    </div>
  );
};

export default EvalPanel;

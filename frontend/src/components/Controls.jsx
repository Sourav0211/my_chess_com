import React from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

const Controls = ({
  currentMoveIndex,
  moveHistoryLength,
  onReset,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {/* Previous Move */}
      <button
        onClick={onPrev}
        disabled={currentMoveIndex < 0}
        className="p-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Move Counter */}
      <span className="text-white font-mono">
        Move {currentMoveIndex + 1} / {moveHistoryLength}
      </span>

      {/* Next Move */}
      <button
        onClick={onNext}
        disabled={currentMoveIndex >= moveHistoryLength - 1}
        className="p-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Reset Board */}
      <button
        onClick={onReset}
        className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
        title="Reset Board"
      >
        <RotateCcw size={22} />
      </button>
    </div>
  );
};

export default Controls;

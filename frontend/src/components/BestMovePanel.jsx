import React from "react";
import { Lightbulb } from "lucide-react";

const BestMovePanel = ({ bestMove, pvLine }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 text-white shadow-lg mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="text-yellow-400" />
        <h3 className="font-bold text-lg">Best Move</h3>
      </div>

      {bestMove ? (
        <>
          <div className="text-3xl font-bold text-green-400 mb-2">
            {bestMove}
          </div>

          {pvLine.length > 0 && (
            <div className="text-sm text-gray-300">
              <span className="font-semibold">PV:</span>{" "}
              {pvLine.join(" ")}
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-sm">Waiting for analysis…</div>
      )}
    </div>
  );
};

export default BestMovePanel;

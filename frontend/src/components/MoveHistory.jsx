import React, { useRef, useEffect } from "react";

const MoveHistory = ({
  moveHistory,
  currentMoveIndex,
  onSelectMove,
}) => {
  // Convert move objects into readable text (e.g., "1. e4", "1... c5")
  const formattedMoves = [];
  const scrollRef = useRef(null);
    useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory, currentMoveIndex]);
  for (let i = 0; i < moveHistory.length; i += 2) {
    const turn = i / 2 + 1;
    const white = moveHistory[i]?.san || "";
    const black = moveHistory[i + 1]?.san || "";
    formattedMoves.push({ turn, white, black });
  }

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4">Move History</h2>
        <div ref={scrollRef} className="w-full max-w-[350px] lg:max-w-full h-64 overflow-y-auto">
{formattedMoves.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-4">
          No moves yet
        </div>
      ) : (
        <table className="w-full text-gray-300 text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-1">#</th>
              <th className="py-1">White</th>
              <th className="py-1">Black</th>
            </tr>
          </thead>
          <tbody>
            {formattedMoves.map((move, index) => (
              <tr key={index}>
                <td className="py-1 pr-2 text-gray-400">{move.turn}.</td>

                {/* White move */}
                <td
                  className={`
                    py-1 cursor-pointer rounded
                    ${currentMoveIndex === index * 2 ? "bg-blue-600 text-white" : "hover:bg-slate-700"}
                  `}
                  onClick={() => onSelectMove(index * 2)}
                >
                  {move.white}
                </td>

                {/* Black move */}
                <td
                  className={`
                    py-1 cursor-pointer rounded
                    ${currentMoveIndex === index * 2 + 1 ? "bg-blue-600 text-white" : "hover:bg-slate-700"}
                  `}
                  onClick={() => onSelectMove(index * 2 + 1)}
                >
                  {move.black}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        </div>
      
    </div>
  );
};

export default MoveHistory;

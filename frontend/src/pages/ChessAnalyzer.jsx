// src/pages/ChessAnalyzer.jsx (or wherever you keep it)
import React, { useState, useEffect } from "react";
import { useChessGame } from "../hooks/useChessGame";
import { useLiveEval } from "../hooks/useLiveEval";

import Board from "../components/Board";
import Controls from "../components/Controls";
import EvalPanel from "../components/EvalPanel";
import MoveHistory from "../components/MoveHistory";
import CapturedPieces from "../components/CapturedPieces";
import BestMovePanel from "../components/BestMovePanel";

const ChessAnalyzer = () => {
  const {
    board,
    fen,
    turn,
    selectedSquare,
    legalMoves,
    lastMove,
    moveHistory,
    currentMoveIndex,
    capturedWhite,
    capturedBlack,
    uciMovesString,
    handleSquareClick,
    handleDragMove,
    resetBoard,
    goToPreviousMove,
    goToNextMove,
    goToMove,
  } = useChessGame();

  const {
    analysis,
    isStreaming: isAnalyzing,
    error,
    bestMove,
    pvLine,
  } = useLiveEval(uciMovesString);

  const [showBestMove, setShowBestMove] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (showBestMove) {
      setShowBestMove(false);
    }
  }, [fen]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Board + Controls */}
        <div className="lg:col-span-2 flex flex-col items-center space-y-6">
          <div className="w-full max-w-[650px]">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowBestMove(true)}
                className={`
                  mt-3 px-4 py-2 rounded-lg font-semibold transition
                  ${showBestMove ? "bg-red-600 text-white" : "bg-blue-600 text-white"}
                `}
              >
                {showBestMove ? "Hide Best Move" : "Show Best Move"}
              </button>

              <button
                onClick={() => setIsFlipped((prev) => !prev)}
                className="mt-3 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold transition hover:bg-purple-700"
              >
                Flip Board
              </button>
            </div>

            <Board
              board={board}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              bestMove={showBestMove ? bestMove : null}
              isFlipped={isFlipped}
              onSquareClick={handleSquareClick}   // now square-based
              onDragEnd={handleDragMove}          // from,to square-based
            />

            <Controls
              currentMoveIndex={currentMoveIndex}
              moveHistoryLength={moveHistory.length}
              onReset={resetBoard}
              onPrev={goToPreviousMove}
              onNext={goToNextMove}
            />
          </div>
        </div>

        {/* Right: Eval, history, captured */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-full max-h-[300px] max-w-[350px] lg:max-w-full">
            <EvalPanel
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              error={error}
              turn={turn}
            />
          </div>

          <div className="w-full max-h-[300px] max-w-[350px] lg:max-w-full">
            <MoveHistory
              moveHistory={moveHistory}
              currentMoveIndex={currentMoveIndex}
              onSelectMove={goToMove}
            />
          </div>

          <div className="w-full max-w-[350px] lg:max-w-full">
            <CapturedPieces
              capturedWhite={capturedWhite}
              capturedBlack={capturedBlack}
            />
          </div>

          <BestMovePanel bestMove={bestMove} pvLine={pvLine} />
        </div>
      </div>
    </div>
  );
};

export default ChessAnalyzer;

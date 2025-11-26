// src/hooks/useChessGame.js
import { useState, useRef, useMemo, useCallback } from "react";
import { Chess } from "chess.js";

function fenToBoard(fen) {
  const [placement] = fen.split(" ");
  const rows = placement.split("/");
  return rows.map((row) => {
    const squares = [];
    for (let char of row) {
      if (!isNaN(char)) {
        for (let i = 0; i < Number(char); i++) squares.push(null);
      } else {
        squares.push(char);
      }
    }
    return squares;
  });
}

export function useChessGame() {
  const gameRef = useRef(new Chess());

  const [fen, setFen] = useState(gameRef.current.fen());
  const [selectedSquare, setSelectedSquare] = useState(null); // "e2"
  const [legalMoves, setLegalMoves] = useState([]); // ["e4", "e3", ...]
  const [moveHistory, setMoveHistory] = useState([]); // Chess.js move objects
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [capturedWhite, setCapturedWhite] = useState([]);
  const [capturedBlack, setCapturedBlack] = useState([]);

  const board = useMemo(() => fenToBoard(fen), [fen]);
  const turn = gameRef.current.turn(); // "w" or "b"

  const uciMovesString = useMemo(() => {
    const verboseMoves = gameRef.current.history({ verbose: true });

    const uciMoves = verboseMoves.map((m) =>
      m.promotion ? `${m.from}${m.to}${m.promotion}` : `${m.from}${m.to}`
    );

    return uciMoves.join(",");
  }, [fen]);

  // Shared move application logic (click + drag)
  const applyMove = useCallback(
    (from, to) => {
      const game = gameRef.current;
      let move;

      try {
        move = game.move({ from, to, promotion: "q" });
      } catch (err) {
        console.error("Illegal move or internal error:", err);
        return false;
      }

      if (!move) return false;

      const newFen = game.fen();

      if (move.captured) {
        if (move.color === "w") {
          setCapturedBlack((prev) => [...prev, move.captured]);
        } else {
          setCapturedWhite((prev) => [...prev, move.captured]);
        }
      }

      setFen(newFen);

      setMoveHistory((prev) => {
        const trimmed = prev.slice(0, currentMoveIndex + 1);
        const updated = [...trimmed, move];
        setCurrentMoveIndex(updated.length - 1);
        return updated;
      });

      setSelectedSquare(null);
      setLegalMoves([]);

      return true;
    },
    [currentMoveIndex]
  );

  // Click-to-move handler: works with algebraic squares now
  const handleSquareClick = useCallback(
    (square) => {
      const game = gameRef.current;
      const piece = game.get(square); // { type: 'p', color: 'w' } or null

      if (selectedSquare) {
        const isLegalDest = legalMoves.includes(square);

        if (!isLegalDest) {
          setSelectedSquare(null);
          setLegalMoves([]);
          return;
        }

        applyMove(selectedSquare, square);
        return;
      }

      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves.map((m) => m.to));
      }
    },
    [selectedSquare, legalMoves, applyMove]
  );

  // Drag-and-drop handler: from/to are "e2", "e4"
  const handleDragMove = useCallback(
    (from, to) => {
      applyMove(from, to);
    },
    [applyMove]
  );

  const goToMove = useCallback(
    (index) => {
      if (index < -1 || index >= moveHistory.length) return;

      const newGame = new Chess();
      const movesToApply = index >= 0 ? moveHistory.slice(0, index + 1) : [];

      for (const m of movesToApply) {
        newGame.move(m);
      }

      gameRef.current = newGame;
      setFen(newGame.fen());
      setCurrentMoveIndex(index);
      setSelectedSquare(null);
      setLegalMoves([]);

      const newCapturedWhite = [];
      const newCapturedBlack = [];
      for (let i = 0; i <= index; i++) {
        const m = moveHistory[i];
        if (m?.captured) {
          if (m.color === "w") newCapturedBlack.push(m.captured);
          else newCapturedWhite.push(m.captured);
        }
      }
      setCapturedWhite(newCapturedWhite);
      setCapturedBlack(newCapturedBlack);
    },
    [moveHistory]
  );

  const resetBoard = useCallback(() => {
    const newGame = new Chess();
    gameRef.current = newGame;
    setFen(newGame.fen());
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setSelectedSquare(null);
    setLegalMoves([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
  }, []);

  const goToPreviousMove = useCallback(() => {
    if (currentMoveIndex < 0) return;

    const newIndex = currentMoveIndex - 1;
    const newGame = new Chess();
    const movesToApply =
      newIndex >= 0 ? moveHistory.slice(0, newIndex + 1) : [];

    for (const m of movesToApply) {
      newGame.move(m);
    }

    gameRef.current = newGame;
    setFen(newGame.fen());
    setCurrentMoveIndex(newIndex);
    setSelectedSquare(null);
    setLegalMoves([]);

    const newCapturedWhite = [];
    const newCapturedBlack = [];
    for (let i = 0; i <= newIndex; i++) {
      const m = moveHistory[i];
      if (m?.captured) {
        if (m.color === "w") newCapturedBlack.push(m.captured);
        else newCapturedWhite.push(m.captured);
      }
    }
    setCapturedWhite(newCapturedWhite);
    setCapturedBlack(newCapturedBlack);
  }, [currentMoveIndex, moveHistory]);

  const goToNextMove = useCallback(() => {
    if (currentMoveIndex >= moveHistory.length - 1) return;

    const newIndex = currentMoveIndex + 1;
    const newGame = new Chess();
    const movesToApply = moveHistory.slice(0, newIndex + 1);

    for (const m of movesToApply) {
      newGame.move(m);
    }

    gameRef.current = newGame;
    setFen(newGame.fen());
    setCurrentMoveIndex(newIndex);
    setSelectedSquare(null);
    setLegalMoves([]);

    const newCapturedWhite = [];
    const newCapturedBlack = [];
    for (let i = 0; i <= newIndex; i++) {
      const m = moveHistory[i];
      if (m?.captured) {
        if (m.color === "w") newCapturedBlack.push(m.captured);
        else newCapturedWhite.push(m.captured);
      }
    }
    setCapturedWhite(newCapturedWhite);
    setCapturedBlack(newCapturedBlack);
  }, [currentMoveIndex, moveHistory]);

  const lastMove = moveHistory[currentMoveIndex] || null;

  return {
    board,
    fen,
    turn,
    selectedSquare,
    legalMoves,
    moveHistory,
    currentMoveIndex,
    lastMove,
    capturedWhite,
    capturedBlack,
    uciMovesString,

    handleSquareClick, // square string
    handleDragMove, // from, to (square strings)
    resetBoard,
    goToPreviousMove,
    goToNextMove,
    goToMove,
  };
}

const stockfish = require("./StockfishManager");

function startEvalStream(moves, res) {
  stockfish.streamEvaluationFromMoves({
    moves,
    targetDepth: 20, // you can tweak this

    onUpdate: (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    },

    onDone: ({ bestMove, ponder, pvLine }) => {
      res.write(
        `event: bestmove\ndata: ${JSON.stringify({
          bestMove,
          ponder,
          pvLine,
        })}\n\n`
      );
      res.end();
    },
  });

  // If client disconnects early, stop engine search
  res.on("close", () => {
    try {
      stockfish.sendCommand && stockfish.sendCommand("stop");
    } catch (_) {}
  });
}

module.exports = { startEvalStream };

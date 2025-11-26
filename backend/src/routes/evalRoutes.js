const express = require("express");
const router = express.Router();
const { startEvalStream } = require("../engine/StockfishSSE");

router.get("/stream-eval", (req, res) => {
  const movesParam = req.query.moves || ""; // "e2e4,e7e5,g1f3"
  const moves = movesParam
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  console.log("Starting SSE stream for moves:", moves.join(" "));

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  startEvalStream(moves, res);
});

module.exports = router;

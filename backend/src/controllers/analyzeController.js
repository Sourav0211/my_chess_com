const stockfish = require("../engine/StockfishManager");

exports.analyzePosition = async (req, res) => {
  try {
    const { fen, options } = req.body;
    if (!fen) {
      return res.status(400).json({ error: "FEN string is required" });
    }
    const result = await stockfish.analyze(fen, options);
    res.json(result);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Engine failed to analyze the position" });
  }
};

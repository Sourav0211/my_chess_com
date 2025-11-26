const express = require("express");
const cors = require("cors");
const analyzeRoutes = require("./src/routes/analyzeRoutes");
const evalRoutes = require("./src/routes/evalRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", analyzeRoutes);
app.use("/api", evalRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Chess Analysis API");
});

app.get("/test-engine", async (req, res) => {
  try {
    const stockfish = require("./src/engine/StockfishManager");
    res.json({
      isReady: stockfish.isReady,
      isAnalyzing: stockfish.isAnalyzing,
      enginePath: stockfish.enginePath,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

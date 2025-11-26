const express = require("express");
const router = express.Router();
const { analyzePosition } = require("../controllers/analyzeController");
const { startEvalStream } = require("../engine/StockfishSSE");

router.post("/analyze-position", analyzePosition);

module.exports = router;

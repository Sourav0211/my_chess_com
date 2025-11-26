// config/engineConfig.js
const path = require("path");

module.exports = {
  depth: 25,
  // Use absolute path from project root
  path: path.join(__dirname, "..", "..", "stockfish", "stockfish"),
};

// test-stockfish.js
const { spawn } = require("child_process");
const path = require("path");

const enginePath = path.join(__dirname, "stockfish", "stockfish");
console.log("Testing path:", enginePath);

const fs = require("fs");
if (!fs.existsSync(enginePath)) {
  console.error("❌ File does not exist!");
  process.exit(1);
}

const engine = spawn(enginePath);

engine.stdout.on("data", (data) => {
  console.log("✅ Output:", data.toString());
});

engine.stderr.on("data", (data) => {
  console.error("⚠️ Error:", data.toString());
});

engine.on("error", (err) => {
  console.error("❌ Spawn error:", err);
});

console.log("Sending uci command...");
engine.stdin.write("uci\n");

setTimeout(() => {
  engine.kill();
  process.exit(0);
}, 2000);

const { spawn } = require("child_process");
const path = require("path");
const EventEmitter = require("events");

class StockfishManager extends EventEmitter {
  constructor() {
    super();

    this.enginePath = path.join(__dirname, "../../stockfish/stockfish");
    this.engine = null;
    this.isReady = false;
    this.isAnalyzing = false;
    this.currentStream = null;

    this.stopTimer = null;
    this.stabilityTimer = null;
    this.lastEval = null;

    this.initEngine();
  }

  initEngine() {
    console.log("🔧 Spawning persistent Stockfish:", this.enginePath);
    this.engine = spawn(this.enginePath);

    this.engine.stdout.on("data", (data) => {
      const text = data.toString();

      if (text.includes("uciok")) this.sendCommand("isready");
      if (text.includes("readyok")) this.isReady = true;

      // ✅ Stream info updates
      if (this.currentStream && text.includes("info")) {
        const depthMatch = text.match(/depth (\d+)/);
        const cpMatch = text.match(/score cp (-?\d+)/);
        const mateMatch = text.match(/score mate (-?\d+)/);
        const pvMatch = text.match(/ pv (.+)/);

        if (pvMatch) {
          const pvMoves = pvMatch[1].trim().split(" ");
          this.currentStream.lastPv = pvMoves;
        }

        if (depthMatch && (cpMatch || mateMatch)) {
          const depth = Number(depthMatch[1]);
          const scoreCp = cpMatch ? Number(cpMatch[1]) : null;
          const mate = mateMatch ? Number(mateMatch[1]) : null;

          this.handleUpdate({ depth, scoreCp, mate });
        }
      }

      // ✅ bestmove → search is done
      if (text.includes("bestmove") && this.currentStream) {
        const bestMoveMatch = text.match(/bestmove (\S+)/);
        const ponderMatch = text.match(/ponder (\S+)/);

        const bestMove = bestMoveMatch ? bestMoveMatch[1] : null;
        const ponder = ponderMatch ? ponderMatch[1] : null;

        const pvLine = this.currentStream.lastPv || [];

        const done = this.currentStream.onDone;
        const result = { bestMove, ponder, pvLine };

        this.cleanup();
        done && done(result);
      }
    });

    // ✅ Engine settings
    this.sendCommand("uci");
    this.sendCommand("setoption name Threads value 4");
    this.sendCommand("setoption name Hash value 1024");
    this.sendCommand("setoption name MultiPV value 1");
  }

  sendCommand(cmd) {
    if (this.engine) this.engine.stdin.write(cmd + "\n");
  }

  cleanup() {
    clearTimeout(this.stopTimer);
    clearTimeout(this.stabilityTimer);
    this.stopTimer = null;
    this.stabilityTimer = null;
    this.lastEval = null;
    this.isAnalyzing = false;
    this.currentStream = null;
  }

  handleUpdate({ depth, scoreCp, mate }) {
    if (!this.currentStream) return;

    this.currentStream.onUpdate?.({ depth, scoreCp, mate });

    // ✅ 2️⃣ Depth-based stop
    if (depth >= this.currentStream.maxDepth) {
      this.sendCommand("stop");
      return;
    }

    // ✅ 3️⃣ Stability-based stop
    if (scoreCp !== null) {
      if (this.lastEval !== null) {
        const diff = Math.abs(scoreCp - this.lastEval);

        if (diff < this.currentStream.stableThreshold) {
          // Schedule stability stop
          clearTimeout(this.stabilityTimer);
          this.stabilityTimer = setTimeout(() => {
            this.sendCommand("stop");
          }, this.currentStream.stableMs);
        }
      }
      this.lastEval = scoreCp;
    }
  }

  /**
   ✅ HYBRID LIMITED INFINITE SEARCH
   */
  streamEvaluationFromMoves({
    moves,
    timeLimitMs = 3000,
    maxDepth = 30,
    stableThreshold = 15, // centipawns
    stableMs = 600,
    onUpdate,
    onDone,
  }) {
    if (!this.isReady) throw new Error("Engine not ready");

    // Stop previous search
    if (this.isAnalyzing) this.sendCommand("stop");

    this.isAnalyzing = true;

    const movesPart = moves.length ? " moves " + moves.join(" ") : "";
    this.sendCommand(`position startpos${movesPart}`);

    this.currentStream = {
      onUpdate,
      onDone,
      maxDepth,
      stableThreshold,
      stableMs,
    };

    this.sendCommand("go infinite");

    // ✅ 1️⃣ Time-based stop
    this.stopTimer = setTimeout(() => {
      this.sendCommand("stop");
    }, timeLimitMs);
  }
}

module.exports = new StockfishManager();

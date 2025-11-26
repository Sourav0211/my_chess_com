import { useState, useEffect } from "react";
import { analyzePosition } from "../services/analysisService";

export function useEngineAnalysis(fen) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fen) return;

    let isCancelled = false;

    async function runAnalysis() {
      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await analyzePosition(fen);
        if (!isCancelled) {
          setAnalysis(result);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Engine error:", err);
          setError(err.message || "Failed to analyze position");
          setAnalysis(null);
        }
      } finally {
        if (!isCancelled) {
          setIsAnalyzing(false);
        }
      }
    }

    runAnalysis();

    return () => {
      isCancelled = true; // Prevent state updates if component unmounts
    };
  }, [fen]);

  return { analysis, isAnalyzing, error };
}

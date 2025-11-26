import { useEffect, useState, useRef } from "react";

export function useLiveEval(movesKey) {
  const [analysis, setAnalysis] = useState(null);
  const [bestMove, setBestMove] = useState(null);
  const [pvLine, setPvLine] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!movesKey) return;

    // Close previous stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setIsStreaming(true);
    setError(null);

    const url = `http://localhost:3000/api/stream-eval?moves=${encodeURIComponent(
      movesKey
    )}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    // ✅ Live eval updates
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAnalysis((prev) => ({ ...prev, ...data }));
    };

    // ✅ Best move + PV
    es.addEventListener("bestmove", (event) => {
      const data = JSON.parse(event.data);
      setBestMove(data.bestMove || null);
      setPvLine(data.pvLine || []);

      setIsStreaming(false);
      es.close();
    });

    es.onerror = () => {
      setError("Engine stream failed");
      setIsStreaming(false);
      es.close();
    };

    return () => es.close();
  }, [movesKey]);

  return { analysis, bestMove, pvLine, isStreaming, error };
}

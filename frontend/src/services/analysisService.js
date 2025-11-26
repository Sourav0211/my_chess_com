export async function analyzePosition(fen) {
  const response = await fetch("http://localhost:3000/api/analyze-position", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fen,
      options: { depth: 25 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Engine returned status ${response.status}`);
  }

  return response.json();
}

// services/geminiProxyClient.ts

export async function getGeminiSummary(title: string, description: string): Promise<string> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  });

  if (!response.ok) {
    throw new Error("Gemini proxy hívás sikertelen");
  }

  const data = await response.json();
  return data.summary;
}

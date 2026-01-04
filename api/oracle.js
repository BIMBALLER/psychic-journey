export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question required" });

  try {
    // ⚡ API key from environment variable (never put key here!)
    const apiKey = process.env.GOOGLE_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            text: `You are a mystical oracle. Answer briefly and insightfully:\nQ: ${question}\nA:`
          },
          maxOutputTokens: 150
        })
      }
    );

    const data = await response.json();

    // ⚡ Gemini free tier may return output[0].content
    const answer =
      data?.candidates?.[0]?.content || data?.generatedText || "No answer available.";

    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

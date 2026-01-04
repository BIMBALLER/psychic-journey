// api/oracle.js
import fetch from "node-fetch";

// Expanded fallback oracle responses
const fallbackResponses = [
  "The answer hides in the pause between thoughts.",
  "What you seek already moves toward you.",
  "Silence will reveal more than action.",
  "Patience and effort must walk together.",
  "Trust yourself, but remain open to change.",
  "The path becomes clear once you commit.",
  "Meaning is not found, it is created through awareness.",
  "Your question reflects a deeper truth about your becoming.",
  "The self you are becoming is asking for discipline, not certainty.",
  "Every step forward reveals what was hidden before.",
  "The mind sees what the heart allows it to see.",
  "Change is the only constant; embrace it fully.",
  "Even in darkness, a single spark can guide you.",
  "Listen to the silence; it carries the deepest truths.",
  "The journey itself holds the answers you seek.",
  "Let go of what you cannot control, and clarity will emerge.",
  "Wisdom often arrives disguised as confusion.",
  "The future unfolds from the choices you make today.",
  "When doubt clouds the mind, action clears the way.",
  "Your intuition knows more than your logic realizes."
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Method not allowed" });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ answer: "No question provided" });
  }

  try {
    const apiKey = "AIzaSyD-TyZeGONgv3695z4EFS1H6l0XroGIYtE"; // your Google API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: question,
        temperature: 0.7,
        maxOutputTokens: 150
      })
    });

    const data = await response.json();

    console.log("Google AI Response:", JSON.stringify(data, null, 2));

    // Use AI response if available, else pick random fallback
    let answer = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    if (data?.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      answer = data.candidates[0].content.trim();
    }

    res.status(200).json({ answer });
  } catch (err) {
    console.error("Oracle API error:", err);

    // Return a random fallback response if API fails
    const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    res.status(200).json({ answer: fallback });
  }
}

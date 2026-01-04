// api/oracle.js
import fetch from "node-fetch";

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

    // Log full response for debugging
    console.log("Google AI Response:", JSON.stringify(data, null, 2));

    // Safely get content
    let answer = "No answer available.";
    if (data?.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      answer = data.candidates[0].content.trim();
    }

    res.status(200).json({ answer });
  } catch (err) {
    console.error("Oracle API error:", err);
    res.status(500).json({ answer: "❌ Oracle could not respond." });
  }
}

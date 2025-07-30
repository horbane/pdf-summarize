module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Only POST allowed" });

  const { text } = req.body;

  const apiKey = "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"; // 👈 insert your OpenRouter key here

  if (!text || !apiKey) {
    console.error("❌ Missing text or API key");
    return res.status(400).json({ error: "Missing input text or API key" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small",
        messages: [
          { role: "system", content: "You are a helpful summarizer." },
          { role: "user", content: `Summarize this:\n\n${text.slice(0, 4000)}` }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ Unexpected response:", data);
      return res.status(500).json({ error: "Unexpected response", raw: data });
    }

    const summary = data.choices[0].message.content;
    res.status(200).json({ summary });
  } catch (err) {
    console.error("💥 Request failed:", err);
    res.status(500).json({ error: "Summarization failed", details: err.message });
  }
};

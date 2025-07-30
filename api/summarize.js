module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Only POST allowed" });

  const { text } = req.body;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing API key");
    return res.status(500).json({ error: "Missing OpenRouter API key" });
  }

  console.log("🔎 Incoming text length:", text?.length || 0);

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
          { role: "user", content: `Summarize this:\n\n${text?.slice(0, 4000)}` }
        ]
      })
    });

    const data = await response.json();

    if (!data || !data.choices) {
      console.error("❌ OpenRouter response error:", data);
      return res.status(500).json({ error: "Unexpected response from model", raw: data });
    }

    const summary = data.choices[0].message.content;
    res.status(200).json({ summary });
  } catch (err) {
    console.error("💥 Fetch failed:", err);
    res.status(500).json({ error: "Summarization failed", details: err.message });
  }
};

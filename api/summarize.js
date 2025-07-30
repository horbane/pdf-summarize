export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { text } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
    const summary = data.choices?.[0]?.message?.content || "No summary found.";
    res.status(200).json({ summary });
  } catch (err) {
    console.error("Error during summarization:", err);
    res.status(500).json({ error: "Failed to summarize" });
  }
}

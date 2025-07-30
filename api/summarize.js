export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { text } = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
  res.status(200).json({ summary: data.choices?.[0]?.message?.content || "No summary found." });
}

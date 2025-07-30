const apiKey = process.env.OPENROUTER_API_KEY;

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

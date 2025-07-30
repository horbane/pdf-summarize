import * as pdfjsLib from "pdfjs-dist/build/pdf";

async function summarize() {
  const file = document.getElementById("pdfInput").files[0];
  if (!file) return alert("Please upload a PDF.");

  document.getElementById("loading").style.display = "block";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(" ") + "\n";
  }

  // Send to backend
  const res = await fetch("/api/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: fullText })
  });

  const data = await res.json();
  document.getElementById("summary").innerText = data.summary;
  document.getElementById("loading").style.display = "none";
}

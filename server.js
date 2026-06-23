const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── Health check ──
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "NU Digital Dashboard",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!CLAUDE_API_KEY,
  });
});

// ── Proxy ke Claude API ──
app.post("/api/chat", async (req, res) => {
  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: "CLAUDE_API_KEY belum dikonfigurasi di environment." });
  }

  const { messages, system } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Format request tidak valid." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: system || "",
        messages: messages.slice(-10), // max 10 pesan terakhir
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Claude API error." });
    }

    res.json({ reply: data.content?.[0]?.text || "" });
  } catch (err) {
    console.error("Error calling Claude API:", err.message);
    res.status(500).json({ error: "Gagal menghubungi Claude API." });
  }
});

// ── Fallback ke index.html ──
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ NU Dashboard berjalan di port ${PORT}`);
  console.log(`🔑 API Key: ${CLAUDE_API_KEY ? "Terkonfigurasi ✓" : "BELUM DISET ✗"}`);
});

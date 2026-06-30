import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to generate posts using server-side Gemini API
  app.post("/api/generate", async (req, res) => {
    try {
      const { topic, tone, industry, platform } = req.body;

      if (!topic || !tone || !industry || !platform) {
        return res.status(400).json({ error: "Missing required fields (topic, tone, industry, platform)" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Construct highly specific instructions matching user requirements
      const systemInstruction = `You are an expert Social Media Manager and Copywriter specializing in professional branding on LinkedIn and Twitter (X) for tech professionals, developers, and entrepreneurs.

Your task is to generate high-converting, engaging, and platform-optimized social media posts based on the provided inputs: Topic, Tone, Industry, and Platform.

Adhere strictly to the following formatting and platform rules:

1. For LINKEDIN:
   - Start with a strong hook line (an attention-grabbing statement, feel free to use bold unicode text or uppercase if it fits the tone, but make it very engaging).
   - Use professional and structured paragraphs with clear spacing (one empty line between paragraphs).
   - Use bullet points (emojis allowed but keep it professional) to explain key takeaways, technologies used, or lessons learned.
   - Conclude with a clear Call to Action (CTA) encouraging community engagement (e.g., "What are your thoughts on this?", "Have you tried X?").
   - Include 3-5 relevant, trending hashtags at the very bottom.

2. For TWITTER (X):
   - Strict character limit: Ensure the entire post fits within 280 characters. Keep it under 280 characters.
   - Make it concise, punchy, and high-impact.
   - Use 1-2 relevant hashtags maximum.
   - If the topic is complex, you may optionally format it as a short Twitter Thread preview (just give Output for Tweet 1, keeping it strictly under 280 characters).

General Instructions:
- Adopt the requested Industry and Tone precisely.
- Do not include any conversational filler (e.g., do not say "Sure, here is your post:" or "Hope this helps!").
- Output ONLY the final generated post content ready to be copied and pasted.`;

      const promptText = `Please generate a post for:
- Topic: ${topic}
- Tone: ${tone}
- Industry: ${industry}
- Platform: ${platform}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const text = response.text || "";
      res.json({ post: text });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: err.message || "Failed to generate social media post" });
    }
  });

  // API Route to forward payloads to Make.com or other automation webhooks
  app.post("/api/webhook", async (req, res) => {
    try {
      const { webhookUrl, payload } = req.body;
      if (!webhookUrl) {
        return res.status(400).json({ error: "Missing webhookUrl" });
      }

      console.log(`Forwarding payload to webhook: ${webhookUrl}`);
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      res.json({
        success: response.ok,
        status: response.status,
        data: responseText
      });
    } catch (err: any) {
      console.error("Webhook forwarding error:", err);
      res.status(500).json({ error: err.message || "Failed to forward payload to webhook" });
    }
  });

  // Vite integration for asset serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

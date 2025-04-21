
import express from "express";
import OpenAI from "openai";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 10000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/idea", async (req, res) => {
  const { sector } = req.body;
  const prompt = `
Bir pazarlama danışmanı olarak hareket et.

Görev: Aşağıdaki sektör için 3 yaratıcı ve uygulanabilir kampanya fikri öner.

SEKTÖR: ${sector}

Kurallar:
- Reklam ajansı, grafik tasarım, logo veya dijital ürün odaklı fikirler VERME.
- Sadece sektörün kendi gerçek ihtiyaçlarına uygun kampanya fikirleri üret.
- Her fikir için kısa bir başlık ve 1-2 cümlelik açıklama yaz.
- Eğlenceli, yenilikçi ama uygulanabilir fikirler öner.

Yanıt formatı (JSON):
[
  { "baslik": "...", "detay": "..." },
  ...
]
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const response = completion.choices[0].message.content.trim();
    const json = JSON.parse(response);
    res.json(json);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Yanıt alınamadı." });
  }
});

app.listen(port, () => {
  console.log("Server running on port", port);
});

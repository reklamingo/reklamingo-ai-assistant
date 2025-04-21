import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });
    const message = chatCompletion.choices[0].message.content;
    res.json({ ideas: JSON.parse(message) });
  } catch (error) {
    console.error("Hata:", error.message);
    res.status(500).json({ error: "Bir hata oluştu." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
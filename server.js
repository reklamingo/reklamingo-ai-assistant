
import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

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
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const response = JSON.parse(chat.choices[0].message.content);
    res.json(response);
  } catch (e) {
    res.status(500).json({ error: "İstek başarısız." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running"));

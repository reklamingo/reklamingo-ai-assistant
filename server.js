
const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const responseText = chatCompletion.choices[0].message.content;

    const campaigns = JSON.parse(responseText);
    const products = campaigns.map(c => c.baslik); // örnek amaçlı

    res.json({ campaigns, products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Hata oluştu");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


import express from "express";
import OpenAI from "openai";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: "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"
});

app.post("/api/idea", async (req, res) => {
  const { sector } = req.body;

  const promptTemplate = fs.readFileSync("./public/assets/prompt.txt", "utf8");
  const prompt = promptTemplate.replace("{{SEKTÖR}}", sector);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const message = chatCompletion.choices[0].message.content;
    res.status(200).json({ message });
  } catch (error) {
    console.error("API Hatası:", error);
    res.status(500).json({ error: "Bir hata oluştu", detay: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Reset sunucu çalışıyor: ${port}`);
});

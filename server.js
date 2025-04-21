
import express from "express";
import OpenAI from "openai";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/idea", async (req, res) => {
  const { sector } = req.body;

  const reklamingoPrompt = fs.readFileSync("./public/assets/reklamingo-smart-prompt.txt", "utf8");
  const prompt = `${reklamingoPrompt}\nSektör: ${sector}`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const message = chatCompletion.choices[0].message.content;
    res.status(200).json({ message });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

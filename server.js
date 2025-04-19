require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/idea', async (req, res) => {
  const { sector } = req.body;

  const prompt = `
"${sector}" sektörü için bir reklam ajansı olarak aşağıdaki formatta yaratıcı fikirler üret.
Her şey tamamen Türkçe olmalı. Ürünleri sadece aşağıdaki listeden seç:

["Sosyal Medya Post Tasarımı", "Instagram Video Üretimi", "Sticker & Etiket Baskı", "Afiş Tasarımı", "Broşür & Katalog", "Logo & Kurumsal Kimlik", "Dijital Sunum Hazırlama", "Seslendirme Hizmeti", "Video Kurgu ve Montaj"]

Yalnızca aşağıdaki JSON formatında çıktılar ver:

{
  "kampanyalar": [
    { "baslik": "...", "detay": "..." },
    ...
  ],
  "sloganlar": ["...", "..."],
  "urunler": ["...", "..."]
}

Sadece geçerli bir JSON objesi döndür. Açıklama ekleme.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Sen yaratıcı bir reklam uzmanısın.' },
        { role: 'user', content: prompt }
      ]
    });

    const rawText = completion.data.choices[0].message.content;
    console.log('YANIT:', rawText);

    const jsonMatch = rawText.match(/{[\s\S]*}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    res.json({
      campaigns: parsed.kampanyalar || [],
      slogans: parsed.sloganlar || [],
      products: parsed.urunler || []
    });
  } catch (err) {
    console.error('HATA:', err.response?.data || err.message);
    res.status(500).json({ error: 'API hatası oluştu' });
  }
});

app.listen(port, () => console.log(`OpenAI destekli sunucu ${port} portunda çalışıyor`));

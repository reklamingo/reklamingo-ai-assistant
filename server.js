require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

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
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'Sen yaratıcı bir reklam uzmanısın.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rawText = response.data.choices[0].message.content;
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

app.listen(port, () => console.log(`Groq destekli sunucu ${port} portunda çalışıyor`));

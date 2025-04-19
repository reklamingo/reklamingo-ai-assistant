require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const productList = [
  'Sosyal Medya Post Tasarımı',
  'Instagram Video Üretimi',
  'Sticker & Etiket Baskı',
  'Afiş Tasarımı',
  'Broşür & Katalog',
  'Logo & Kurumsal Kimlik',
  'Dijital Sunum Hazırlama',
  'Seslendirme Hizmeti',
  'Video Kurgu ve Montaj'
];

app.post('/api/idea', async (req, res) => {
  const { sector } = req.body;
  const prompt = `Bir reklam ajansı olarak "${sector}" sektörüne özel 3 kampanya fikri, 3-5 yaratıcı slogan ve bu sektöre uygun ürün önerilerini sırala.`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openchat/openchat-7b',
        messages: [
          { role: 'system', content: 'Sen yaratıcı bir reklam uzmanısın.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0].message.content;
    const campaigns = [...text.matchAll(/Kampanya [0-9]+: (.*)/g)].map(m => m[1]) || [];
    const slogans = [...text.matchAll(/Slogan: (.*)/g)].map(m => m[1]) || [];
    const products = productList.filter(p => text.toLowerCase().includes(p.toLowerCase().split(' ')[0]));

    res.json({ campaigns, slogans, products });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'API hatası oluştu' });
  }
});

app.listen(port, () => console.log(`OpenRouter destekli server ${port} portunda çalışıyor`));

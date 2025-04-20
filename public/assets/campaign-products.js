
function getProductsForCampaign(title) {
  title = title.toLowerCase();
  const matched = [];

  if (title.includes("mağaza önü") || title.includes("etkinlik")) {
    matched.push("X-Banner", "Roll-up", "Branda");
  }

  if (title.includes("indirim") || title.includes("kampanya")) {
    matched.push("Foreks Baskı", "Branda", "Afiş");
  }

  if (title.includes("sosyal medya") || title.includes("instagram") || title.includes("dijital")) {
    matched.push("Instagram Gönderisi", "Facebook Banner", "Sosyal Medya Post Tasarımı");
  }

  if (title.includes("yeni ürün") || title.includes("tanıtım") || title.includes("test")) {
    matched.push("Broşür", "Instagram Post Tasarımı", "Sosyal Medya Görseli");
  }

  if (title.includes("iletişim") || title.includes("tanıtım") || title.includes("görüşme")) {
    matched.push("Kartvizit", "Kalem");
  }

  if (title.includes("etiket") || title.includes("etiketleme")) {
    matched.push("Sticker", "Etiket");
  }

  if (title.includes("ses") || title.includes("anons")) {
    matched.push("Seslendirme", "Anons Tasarımı");
  }

  if (title.includes("sunum") || title.includes("toplantı")) {
    matched.push("Sunum Tasarımı", "PDF Katalog");
  }

  // Eşleşen ürünlerden tekrarları sil ve en fazla 3 tane al
  const unique = [...new Set(matched)];
  return unique.slice(0, 3);
}

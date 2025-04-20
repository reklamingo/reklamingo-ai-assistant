
function getSmartProductSuggestions(productArray, count = 3) {
  const shuffled = productArray.slice().sort(() => 0.5 - Math.random());

  // Foreks Baskı'yı sona taşı
  const filtered = shuffled.filter(p => !p.name.toLowerCase().includes("foreks"));
  const foreks = shuffled.filter(p => p.name.toLowerCase().includes("foreks"));
  const finalList = [...filtered, ...foreks];

  return finalList.slice(0, count);
}

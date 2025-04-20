
function getRandomProducts(productLinks, count = 3) {
  const keys = Object.keys(productLinks);
  const selected = [];
  while (selected.length < count && keys.length > 0) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    const item = keys.splice(randomIndex, 1)[0];
    selected.push({ name: item, link: productLinks[item] });
  }
  return selected;
}

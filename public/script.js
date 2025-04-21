
document.getElementById("ideaForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const sector = document.getElementById("sectorInput").value;
  document.getElementById("loadingBar").style.display = "block";
  document.getElementById("results").style.display = "none";
  const res = await fetch("/api/idea", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sector })
  });
  const data = await res.json();
  document.getElementById("loadingBar").style.display = "none";
  document.getElementById("results").style.display = "flex";
  const campaignList = document.querySelector("#campaigns ul");
  campaignList.innerHTML = "";
  data.campaigns.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${c.baslik}</strong><br>${c.detay}`;
    campaignList.appendChild(li);
  });
  const productList = document.querySelector("#products ul");
  productList.innerHTML = "";
  data.products.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    productList.appendChild(li);
  });
});

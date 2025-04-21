
document.getElementById("ideaForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("sectorInput").value;
  const button = document.getElementById("generateButton");
  const resultBox = document.getElementById("resultContainer");
  const list = document.getElementById("campaignList");
  const loading = document.getElementById("loadingBar");

  list.innerHTML = "";
  resultBox.classList.add("hidden");
  loading.style.width = "100%";
  button.classList.add("clicked");

  try {
    const res = await fetch("/api/idea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sector: input })
    });

    const ideas = await res.json();
    list.innerHTML = ideas.map(idea => \`<li><strong>\${idea.baslik}</strong>: \${idea.detay}</li>\`).join("");
    resultBox.classList.remove("hidden");
  } catch (err) {
    list.innerHTML = "<li>Bir hata oluştu.</li>";
    resultBox.classList.remove("hidden");
  }

  loading.style.width = "0%";
});

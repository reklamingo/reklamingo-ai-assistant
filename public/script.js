document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("ideaForm");
    const input = document.getElementById("sectorInput");
    const button = document.getElementById("generateBtn");
    const ideasList = document.getElementById("ideasList");
    const results = document.getElementById("results");
    const loadingBar = document.getElementById("loadingBar");

    button.classList.add("glow");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const sector = input.value.trim();
        if (!sector) return;

        loadingBar.classList.remove("hidden");
        results.classList.add("hidden");
        button.classList.remove("glow");

        const prompt = `
Bir pazarlama danışmanı gibi düşün. Aşağıdaki sektör için 3 yaratıcı ve uygulanabilir kampanya fikri üret.
- Grafik tasarım, dijital reklam gibi genel öneriler verme.
- Her fikir için kısa bir başlık ve açıklama yaz.
- Format: JSON [{ "baslik": "...", "detay": "..." }]
SEKTÖR: ${sector}`;

        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer YOUR_API_KEY"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            });
            const data = await res.json();
            const content = data.choices[0].message.content;
            const ideas = JSON.parse(content);

            ideasList.innerHTML = "";
            ideas.forEach(idea => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${idea.baslik}</strong>: ${idea.detay}`;
                ideasList.appendChild(li);
            });
            loadingBar.classList.add("hidden");
            results.classList.remove("hidden");
        } catch (err) {
            loadingBar.classList.add("hidden");
            ideasList.innerHTML = "<li>Bir hata oluştu.</li>";
            results.classList.remove("hidden");
        }
    });
});

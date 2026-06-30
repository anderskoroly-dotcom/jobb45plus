fetch("https://jobsearch.api.jobtechdev.se/search?limit=1000&offset=0")
  .then(r => r.json())
  .then(data => {
    const jobs = data.hits || [];
    const container = document.getElementById("job-container");
    container.innerHTML = "";

    if (jobs.length === 0) {
      container.innerHTML = "<p>Inga jobb hittades.</p>";
      return;
    }

    jobs.forEach(job => {
      const div = document.createElement("div");
      div.className = "job-item";

      div.innerHTML = `
        <h3>${job.headline}</h3>
        <p><strong>Arbetsgivare:</strong> ${job.employer?.name || "Okänd"}</p>
        <p><strong>Ort:</strong> ${job.workplace_address?.municipality || "Ej angivet"}</p>
        <p><strong>Län:</strong> ${job.workplace_address?.region || "Ej angivet"}</p>
        <p><strong>Kategori:</strong> ${job.occupation_field?.label || "Ej angivet"}</p>
        <a href="${job.webpage_url}" target="_blank">Läs mer</a>
      `;

      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Fel vid hämtning:", err);
    const container = document.getElementById("job-container");
    container.innerHTML = "<p>Kunde inte hämta jobbdata.</p>";
  });


fetch("https://jobsearch.api.jobtechdev.se/search?limit=20&offset=0")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("job-container");

    data.hits.forEach(job => {
      const div = document.createElement("div");
      div.classList.add("job-item");

      div.innerHTML = `
        <h3>${job.headline}</h3>
        <p><strong>Arbetsgivare:</strong> ${job.employer?.name || "Okänd"}</p>
        <p><strong>Ort:</strong> ${job.workplace_address?.municipality || "Ej angivet"}</p>
        <a href="${job.webpage_url}" target="_blank">Läs mer</a>
      `;

      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Fel vid hämtning av jobb:", err);
  });


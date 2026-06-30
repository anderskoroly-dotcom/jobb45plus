// 🔵 Hämta jobb från JobTech API
let allJobs = [];

fetch("https://jobsearch.api.jobtechdev.se/search?limit=100&offset=0")
  .then(response => response.json())
  .then(data => {
    allJobs = data.hits;
    renderJobs(allJobs);
  })
  .catch(err => console.error("Fel vid hämtning av jobb:", err));

function renderJobs(jobs) {
  const container = document.getElementById("job-container");
  container.innerHTML = "";

  jobs.forEach(job => {
    const div = document.createElement("div");
    div.classList.add("job-item");

    div.innerHTML = `
      <h3>${job.headline}</h3>
      <p><strong>Arbetsgivare:</strong> ${job.employer?.name || "Okänd"}</p>
      <p><strong>Ort:</strong> ${job.workplace_address?.municipality || "Ej angivet"}</p>
      <p><strong>Län:</strong> ${job.workplace_address?.region || "Ej angivet"}</p>
      <p><strong>Kategori:</strong> ${job.occupation_field?.label || "Ej angivet"}</p>
      <p><strong>Utbildningskrav:</strong> ${job.must_have_education ? "Ja" : "Nej"}</p>
      <a href="${job.webpage_url}" target="_blank">Läs mer</a>
    `;
    container.appendChild(div);
  });
}

// 🔍 Sök- och filterfunktion
document.getElementById("searchButton").addEventListener("click", () => applyFilters());
document.getElementById("filter45plus").addEventListener("click", () => applyFilters(true, false));
document.getElementById("filterNoEducation").addEventListener("click", () => applyFilters(false, true));

function applyFilters(is45plus = false, noEducation = false) {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const regionTerm = document.getElementById("regionFilter").value.toLowerCase();
  const categoryTerm = document.getElementById("categoryFilter").value.toLowerCase();

  const filtered = allJobs.filter(job => {
    const text = `${job.headline} ${job.employer?.name} ${job.workplace_address?.municipality} ${job.workplace_address?.region} ${job.occupation_field?.label}`.toLowerCase();

    const matchSearch = text.includes(searchTerm);
    const matchRegion = regionTerm === "" || text.includes(regionTerm);
    const matchCategory = categoryTerm === "" || text.includes(categoryTerm);

    // 45+ filter (heuristik: ord som "erfaren", "senior", "specialist")
    const match45plus = !is45plus || /erfaren|senior|specialist|chef|ledare/.test(text);

    // Utan utbildningskrav (heuristik: saknar utbildningsfält eller nämner "ingen utbildning krävs")
    const matchNoEdu = !noEducation || (!job.must_have_education && /ingen utbildning|utan utbildning|okvalificerad|lager|städ|chaufför/.test(text));

    return matchSearch && matchRegion && matchCategory && match45plus && matchNoEdu;
  });

  renderJobs(filtered);
}



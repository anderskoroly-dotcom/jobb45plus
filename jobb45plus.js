let allJobs = [];

// 🔹 Hämta jobb (senaste 1000 annonser i hela Sverige)
fetch("https://jobsearch.api.jobtechdev.se/search?limit=1000&offset=0")
  .then(response => response.json())
  .then(data => {
    allJobs = data.hits || [];
    renderJobs(allJobs);
    initRegionMunicipality();
  })
  .catch(err => console.error("Fel vid hämtning av jobb:", err));

// 🔹 Bygg kommun-lista dynamiskt utifrån jobben
function initRegionMunicipality() {
  const regionSelect = document.getElementById("regionFilter");
  const municipalitySelect = document.getElementById("municipalityFilter");

  municipalitySelect.innerHTML = '<option value="">Alla kommuner</option>';

  regionSelect.addEventListener("change", () => {
    const region = regionSelect.value;
    municipalitySelect.innerHTML = '<option value="">Alla kommuner</option>';

    if (!region) return;

    const municipalitiesSet = new Set();

    allJobs.forEach(job => {
      const jobRegion = job.workplace_address?.region;
      const jobMunicipality = job.workplace_address?.municipality;
      if (jobRegion === region && jobMunicipality) {
        municipalitiesSet.add(jobMunicipality);
      }
    });

    Array.from(municipalitiesSet)
      .sort()
      .forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        municipalitySelect.appendChild(option);
      });
  });
}

// 🔹 Visa jobben
function renderJobs(jobs) {
  const container = document.getElementById("job-container");
  container.innerHTML = "";

  if (!jobs || jobs.length === 0) {
    container.innerHTML = "<p>Inga jobb hittades.</p>";
    return;
  }

  jobs.forEach(job => {
    const div = document.createElement("div");
    div.classList.add("job-item");

    const text = job.description?.text?.toLowerCase() || "";
    const noEdu = /ingen utbildning|utan utbildning|okvalificerad|lager|städ|chaufför|bud|paketplockare|industriarbetare|montör|produktionspersonal/.test(text);

    div.innerHTML = `
      <h3>${job.headline}</h3>
      <p><strong>Arbetsgivare:</strong> ${job.employer?.name || "Okänd"}</p>
      <p><strong>Ort:</strong> ${job.workplace_address?.municipality || "Ej angivet"}</p>
      <p><strong>Län:</strong> ${job.workplace_address?.region || "Ej angivet"}</p>
      <p><strong>Kategori:</strong> ${job.occupation_field?.label || "Ej angivet"}</p>
      <p><strong>Utbildningskrav:</strong> ${noEdu ? "Nej" : "Ja"}</p>
      <a href="${job.webpage_url}" target="_blank">Läs mer</a>
    `;
    container.appendChild(div);
  });
}

// 🔹 Filtrering
function applyFilters(is45plus = false, noEducation = false) {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const regionTerm = document.getElementById("regionFilter").value.toLowerCase();
  const municipalityTerm = document.getElementById("municipalityFilter").value.toLowerCase();
  const categoryTerm = document.getElementById("categoryFilter").value.toLowerCase();

  const fortyFivePlusWords = [
    "erfaren", "rutinerad", "yrkesvan", "mångårig", "gedigen", "lång erfarenhet",
    "trygg i rollen", "självgående", "självständig", "stabil", "pålitlig",
    "noggrann", "ansvarsfull", "kvalitetsmedveten", "strukturerad", "metodisk",
    "mentor", "handledare", "coach", "teamledare", "arbetsledare", "gruppledare",
    "senior", "specialist", "expert", "chef", "ledare", "pensionär", "mogen",
    "nystartsjobb", "omställning", "arbetsmarknadsinsats", "introducera",
    "handledning", "kvalitetssäkring", "processansvar", "utbilda andra",
    "pedagogisk", "kommunikativ", "socialt kompetent", "lösningsorienterad"
  ];

  const filtered = allJobs.filter(job => {
    const text = `${job.headline} ${job.employer?.name} ${job.description?.text}`.toLowerCase();
    const jobRegion = job.workplace_address?.region?.toLowerCase() || "";
    const jobMunicipality = job.workplace_address?.municipality?.toLowerCase() || "";
    const jobCategory = job.occupation_field?.label?.toLowerCase() || "";

    const matchSearch = searchTerm === "" || text.includes(searchTerm);
    const matchRegion = regionTerm === "" || jobRegion.includes(regionTerm);
    const matchMunicipality = municipalityTerm === "" || jobMunicipality.includes(municipalityTerm);
    const matchCategory = categoryTerm === "" || jobCategory.includes(categoryTerm);
    const match45plus = !is45plus || fortyFivePlusWords.some(word => text.includes(word));
    const matchNoEdu =
      !noEducation ||
      /ingen utbildning|utan utbildning|okvalificerad|lager|städ|chaufför|bud|paketplockare|industriarbetare|montör|produktionspersonal/.test(text);

    return matchSearch && matchRegion && matchMunicipality && matchCategory && match45plus && matchNoEdu;
  });

  renderJobs(filtered);
}

// 🔹 Knappar
document.getElementById("searchButton").addEventListener("click", () => applyFilters());
document.getElementById("filter45plus").addEventListener("click", () => applyFilters(true, false));
document.getElementById("filterNoEducation").addEventListener("click", () => applyFilters(false, true));


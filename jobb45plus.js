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

  const fortyFivePlusWords = [
    "erfaren", "rutinerad", "yrkesvan", "mångårig", "gedigen", "lång erfarenhet",
    "trygg i rollen", "självgående", "självständig", "stabil", "pålitlig",
    "noggrann", "ansvarsfull", "kvalitetsmedveten", "strukturerad", "metodisk",

    "mentor", "handledare", "coach", "teamledare", "arbetsledare", "gruppledare",
    "senior", "specialist", "expert", "chef", "ledare",

    "pensionär", "mogen", "nystartsjobb", "omställning", "arbetsmarknadsinsats",
    "introducera", "handledning", "kvalitetssäkring", "processansvar",
    "utbilda andra", "pedagogisk", "kommunikativ", "socialt kompetent",
    "lösningsorienterad"
  ];

  const filtered = allJobs.filter(job => {
    const text = `${job.headline} ${job.employer?.name} ${job.description?.text}`.toLowerCase();

    // ⭐ Fritext
    const matchSearch = text.includes(searchTerm);

    // ⭐ Län (riktigt fält)
    const jobRegion = job.workplace_address?.region?.toLowerCase() || "";
    const matchRegion = regionTerm === "" || jobRegion.includes(regionTerm);

    // ⭐ Yrkesområde (riktigt fält)
    const jobCategory = job.occupation_field?.label?.toLowerCase() || "";
    const matchCategory = categoryTerm === "" || jobCategory.includes(categoryTerm);

    // ⭐ 45+ filter (sök i text)
    const match45plus = !is45plus || fortyFivePlusWords.some(word => text.includes(word));

    // ⭐ Utan utbildning (sök i text — inte API-fältet)
    const matchNoEdu =
      !noEducation ||
      /ingen utbildning|utan utbildning|okvalificerad|lager|städ|chaufför|bud|paketplockare|industriarbetare|montör|produktionspersonal/.test(text);

    return matchSearch && matchRegion && matchCategory && match45plus && matchNoEdu;
  });

  renderJobs(filtered);
}


  renderJobs(filtered);
}



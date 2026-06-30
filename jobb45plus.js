// 🔹 Kommuner per län
const municipalitiesByRegion = {
  "Östergötlands län": [
    "Norrköping", "Linköping", "Motala", "Mjölby", "Finspång",
    "Söderköping", "Vadstena", "Boxholm", "Kinda", "Ydre", "Åtvidaberg"
  ],
  "Stockholms län": [
    "Stockholm", "Solna", "Sundbyberg", "Täby", "Nacka", "Södertälje",
    "Haninge", "Huddinge", "Botkyrka", "Lidingö", "Vallentuna"
  ],
  "Skåne län": [
    "Malmö", "Lund", "Helsingborg", "Kristianstad", "Trelleborg",
    "Ängelholm", "Höganäs", "Eslöv", "Ystad", "Simrishamn"
  ],
  "Västra Götalands län": [
    "Göteborg", "Borås", "Trollhättan", "Uddevalla", "Skövde",
    "Lidköping", "Alingsås", "Kungälv", "Falköping", "Mariestad"
  ],
  "Södermanlands län": [
    "Nyköping", "Oxelösund", "Eskilstuna", "Strängnäs", "Katrineholm",
    "Flen", "Vingåker", "Gnesta", "Trosa"
  ],
  "Jönköpings län": [
    "Jönköping", "Nässjö", "Vetlanda", "Tranås", "Eksjö",
    "Gislaved", "Värnamo", "Sävsjö", "Aneby", "Mullsjö", "Habo"
  ],
  "Uppsala län": ["Uppsala", "Enköping", "Tierp", "Östhammar", "Heby", "Knivsta"],
  "Västmanlands län": ["Västerås", "Köping", "Sala", "Fagersta", "Arboga", "Norberg", "Skinnskatteberg"],
  "Örebro län": ["Örebro", "Karlskoga", "Hallsberg", "Kumla", "Lindesberg", "Laxå", "Degerfors"],
  "Kalmar län": ["Kalmar", "Västervik", "Oskarshamn", "Nybro", "Mönsterås", "Hultsfred", "Vimmerby"],
  "Norrbottens län": ["Luleå", "Piteå", "Boden", "Kiruna", "Gällivare", "Älvsbyn", "Kalix", "Haparanda"]
};

document.addEventListener("DOMContentLoaded", () => {
  const regionSelect = document.getElementById("regionFilter");
  const municipalitySelect = document.getElementById("municipalityFilter");
  municipalitySelect.innerHTML = '<option value="">Alla kommuner</option>';

  regionSelect.addEventListener("change", () => {
    const region = regionSelect.value;
    municipalitySelect.innerHTML = '<option value="">Alla kommuner</option>';
    if (municipalitiesByRegion[region]) {
      municipalitiesByRegion[region].forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        municipalitySelect.appendChild(option);
      });
    }
  });
});

let allJobs = [];
let currentBlock = 0; // 0 = senaste 30 dagar, 1 = 30–60, 2 = 60–90

// 🔹 Hjälpfunktion för datum
function formatDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

// 🔹 Hämta ett block (30 dagar)
async function fetchJobsBlock(blockIndex) {
  let fromDays, toDays;
  if (blockIndex === 0) {
    fromDays = 30;
    toDays = 0;
  } else if (blockIndex === 1) {
    fromDays = 60;
    toDays = 30;
  } else if (blockIndex === 2) {
    fromDays = 90;
    toDays = 60;
  } else {
    return []; // inga fler block
  }

  const publishedAfter = formatDate(fromDays);
  const publishedBefore = formatDate(toDays);

  let offset = 0;
  const limit = 1000;
  let results = [];
  let more = true;

  while (more) {
    const url = `https://jobsearch.api.jobtechdev.se/search?limit=${limit}&offset=${offset}&published-after=${publishedAfter}&published-before=${publishedBefore}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      results = results.concat(data.hits);
      offset += limit;
    } else {
      more = false;
    }
  }

  return results;
}

// 🔹 Visa jobben
function renderJobs(jobs) {
  const container = document.getElementById("job-container");
  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = "<p>Inga jobb hittades med dessa filter.</p>";
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

    const matchSearch = text.includes(searchTerm);
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

// 🔹 Init: hämta första 30 dagar
(async () => {
  const block0 = await fetchJobsBlock(0);
  allJobs = allJobs.concat(block0);
  renderJobs(allJobs);
})();

// 🔹 Knappar
document.getElementById("searchButton").addEventListener("click", () => applyFilters());
document.getElementById("filter45plus").addEventListener("click", () => applyFilters(true, false));
document.getElementById("filterNoEducation").addEventListener("click", () => applyFilters(false, true));

document.getElementById("loadOlderButton").addEventListener("click", async () => {
  if (currentBlock >= 2) {
    alert("Inga äldre jobb (max 90 dagar bakåt).");
    return;
  }
  currentBlock++;
  const moreJobs = await fetchJobsBlock(currentBlock);
  allJobs = allJobs.concat(moreJobs);
  applyFilters(); // behåll aktuella filter när vi lägger till fler jobb
});



// ===============================
//   KOMMUNER PER LÄN (FAST LISTA)
// ===============================

const municipalitiesByRegion = {
  "Blekinge län": ["Karlshamn", "Karlskrona", "Olofström", "Ronneby", "Sölvesborg"],
  "Dalarnas län": ["Avesta", "Borlänge", "Falun", "Gagnef", "Hedemora", "Leksand", "Ludvika", "Malung-Sälen", "Mora", "Orsa", "Rättvik", "Smedjebacken", "Säter", "Vansbro", "Älvdalen"],
  "Gotlands län": ["Gotland"],
  "Gävleborgs län": ["Bollnäs", "Gävle", "Hofors", "Hudiksvall", "Ljusdal", "Nordanstig", "Ockelbo", "Ovanåker", "Sandviken", "Söderhamn"],
  "Hallands län": ["Falkenberg", "Halmstad", "Hylte", "Kungsbacka", "Laholm", "Varberg"],
  "Jämtlands län": ["Berg", "Bräcke", "Härjedalen", "Krokom", "Ragunda", "Strömsund", "Åre", "Östersund"],
  "Jönköpings län": ["Aneby", "Eksjö", "Gislaved", "Gnosjö", "Habo", "Jönköping", "Mullsjö", "Nässjö", "Sävsjö", "Tranås", "Vaggeryd", "Vetlanda", "Värnamo"],
  "Kalmar län": ["Borgholm", "Emmaboda", "Hultsfred", "Högsby", "Kalmar", "Mönsterås", "Mörbylånga", "Nybro", "Oskarshamn", "Torsås", "Vimmerby", "Västervik"],
  "Kronobergs län": ["Alvesta", "Lessebo", "Ljungby", "Markaryd", "Tingsryd", "Uppvidinge", "Växjö", "Älmhult"],
  "Norrbottens län": ["Arjeplog", "Arvidsjaur", "Boden", "Gällivare", "Haparanda", "Jokkmokk", "Kalix", "Kiruna", "Luleå", "Pajala", "Piteå", "Älvsbyn", "Överkalix", "Övertorneå"],
  "Skåne län": ["Bjuv", "Bromölla", "Burlöv", "Båstad", "Eslöv", "Helsingborg", "Hässleholm", "Höganäs", "Hörby", "Höör", "Klippan", "Kristianstad", "Kävlinge", "Landskrona", "Lomma", "Lund", "Malmö", "Osby", "Perstorp", "Simrishamn", "Sjöbo", "Skurup", "Staffanstorp", "Svalöv", "Svedala", "Tomelilla", "Trelleborg", "Vellinge", "Ystad", "Åstorp", "Ängelholm", "Örkelljunga"],
  "Stockholms län": ["Botkyrka", "Danderyd", "Ekerö", "Haninge", "Huddinge", "Järfälla", "Lidingö", "Nacka", "Norrtälje", "Nykvarn", "Nynäshamn", "Salem", "Sigtuna", "Sollentuna", "Solna", "Stockholm", "Sundbyberg", "Södertälje", "Täby", "Upplands Väsby", "Upplands-Bro", "Vallentuna", "Vaxholm", "Värmdö", "Österåker"],
  "Södermanlands län": ["Eskilstuna", "Flen", "Gnesta", "Katrineholm", "Nyköping", "Oxelösund", "Strängnäs", "Trosa", "Vingåker"],
  "Uppsala län": ["Älvkarleby", "Heby", "Håbo", "Knivsta", "Tierp", "Uppsala", "Östhammar"],
  "Värmlands län": ["Arvika", "Eda", "Filipstad", "Forshaga", "Grums", "Hagfors", "Hammarö", "Karlstad", "Kil", "Kristinehamn", "Munkfors", "Storfors", "Sunne", "Säffle", "Torsby"],
  "Västerbottens län": ["Bjurholm", "Dorotea", "Lycksele", "Malå", "Nordmaling", "Norsjö", "Robertsfors", "Skellefteå", "Sorsele", "Storuman", "Umeå", "Vilhelmina", "Vindeln", "Vännäs", "Åsele"],
  "Västernorrlands län": ["Härnösand", "Kramfors", "Sollefteå", "Sundsvall", "Timrå", "Ånge", "Örnsköldsvik"],
  "Västmanlands län": ["Arboga", "Fagersta", "Hallstahammar", "Kungsör", "Köping", "Norberg", "Sala", "Skinnskatteberg", "Surahammar", "Västerås"],
  "Västra Götalands län": ["Ale", "Alingsås", "Bengtsfors", "Bollebygd", "Borås", "Dals-Ed", "Essunga", "Falköping", "Färgelanda", "Grästorp", "Gullspång", "Göteborg", "Götene", "Herrljunga", "Hjo", "Härryda", "Karlsborg", "Kungälv", "Lerum", "Lidköping", "Lilla Edet", "Mariestad", "Mark", "Mellerud", "Munkedal", "Mölndal", "Orust", "Partille", "Skara", "Skövde", "Sotenäs", "Stenungsund", "Strömstad", "Svenljunga", "Tanum", "Tibro", "Tidaholm", "Tjörn", "Tranemo", "Trollhättan", "Töreboda", "Uddevalla", "Ulricehamn", "Vara", "Vårgårda", "Vänersborg", "Åmål", "Öckerö"],
  "Örebro län": ["Askersund", "Degerfors", "Hallsberg", "Hällefors", "Karlskoga", "Kumla", "Laxå", "Lekeberg", "Lindesberg", "Nora", "Örebro"],
  "Östergötlands län": ["Boxholm", "Finspång", "Kinda", "Linköping", "Mjölby", "Motala", "Norrköping", "Söderköping", "Vadstena", "Valdemarsvik", "Ydre", "Åtvidaberg", "Ödeshög"]
};


// ===============================
//   HÄMTA JOBB (ENKEL VERSION)
// ===============================

fetch("https://jobsearch.api.jobtechdev.se/search?limit=100&offset=0")
  .then(response => response.json())
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
  .catch(error => {
    console.error("Fel vid hämtning av jobb:", error);
    const container = document.getElementById("job-container");
    container.innerHTML = "<p>Kunde inte hämta jobbdata.</p>";
  });


// ===============================
//   VISA KOMMUNER NÄR LÄN VÄLJS
// ===============================

const regionFilter = document.getElementById("regionFilter");
const municipalityContainer = document.getElementById("municipalityContainer");
const municipalityList = document.getElementById("municipalityList");
const selectedRegionName = document.getElementById("selectedRegionName");
const selectAllMunicipalities = document.getElementById("selectAllMunicipalities");
const clearMunicipalities = document.getElementById("clearMunicipalities");

regionFilter.addEventListener("change", () => {
  const region = regionFilter.value;

  if (!region || !municipalitiesByRegion[region]) {
    municipalityContainer.style.display = "none";
    return;
  }

  selectedRegionName.textContent = region;
  municipalityList.innerHTML = "";

  municipalitiesByRegion[region].forEach(m => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" class="municipalityCheckbox" value="${m}"> ${m}`;
    municipalityList.appendChild(label);
  });

  municipalityContainer.style.display = "block";
});

selectAllMunicipalities.addEventListener("change", () => {
  document.querySelectorAll(".municipalityCheckbox").forEach(b => {
    b.checked = selectAllMunicipalities.checked;
  });
});

clearMunicipalities.addEventListener("click", () => {
  municipalityContainer.style.display = "none";
  regionFilter.value = "";
});


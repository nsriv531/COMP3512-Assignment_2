document.addEventListener("DOMContentLoaded", () => {
  const seasonSelect = document.getElementById("season-select");
  const viewRacesBtn = document.getElementById("view-races-btn");
  const raceViewMessage = document.getElementById("race-view-message");
  const raceList = document.getElementById("race-list");
  const qualifyingResults = document.getElementById("qualifying-results");
  const raceResults = document.getElementById("race-results");

  // Mocked sample results
  const sampleResults = {
    qualifying: [
      { pos: 1, name: "Max Verstappen", constructor: "Red Bull", q1: "1:27.23", q2: "1:23.23", q3: "1:22.98" },
      { pos: 2, name: "Charles Leclerc", constructor: "Ferrari", q1: "1:27.35", q2: "1:23.56", q3: "1:23.12" },
    ],
    race: [
      { pos: 1, name: "Max Verstappen", constructor: "Red Bull", laps: 58, points: 25 },
      { pos: 2, name: "Charles Leclerc", constructor: "Ferrari", laps: 58, points: 18 },
    ],
  };

  viewRacesBtn.addEventListener("click", async () => {
    const selectedSeason = seasonSelect.value;

    if (!selectedSeason) {
      raceViewMessage.textContent = "No season selected";
      raceList.innerHTML = "";
      return;
    }

    try {
      const response = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${selectedSeason}`);
      const races = await response.json();

      if (races.length === 0) {
        raceViewMessage.textContent = `No races found for ${selectedSeason}`;
        raceList.innerHTML = "";
        return;
      }

      raceViewMessage.textContent = `Races for the ${selectedSeason} Season:`;
      raceList.innerHTML = "";

      races.forEach((race) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <div class="box">
            <h2 class="title is-5">${race.name} (${race.date})</h2>
            <p><strong>Round:</strong> ${race.round}</p>
            <p><strong>Location:</strong> ${race.circuit.location}, ${race.circuit.country}</p>
            <button class="button is-link view-results-btn" data-race-id="${race.id}">View Results</button>
          </div>
        `;
        raceList.appendChild(listItem);

        listItem.querySelector(".view-results-btn").addEventListener("click", () => {
          displayResults(sampleResults); // Mocked results
        });
      });
    } catch (error) {
      console.error(error);
      raceViewMessage.textContent = "Failed to load data.";
    }
  });

  function displayResults(results) {
    qualifyingResults.innerHTML = results.qualifying
      .map((q) => `<tr><td>${q.pos}</td><td>${q.name}</td><td>${q.constructor}</td><td>${q.q1}</td><td>${q.q2}</td><td>${q.q3}</td></tr>`)
      .join("");

    raceResults.innerHTML = results.race
      .map((r) => `<tr><td>${r.pos}</td><td>${r.name}</td><td>${r.constructor}</td><td>${r.laps}</td><td>${r.points}</td></tr>`)
      .join("");
  }

  function updatePodium(results) {
    const podiumData = results.slice(0, 3); // Get the top 3 drivers
    const podiumPlaces = document.querySelectorAll(".podium-place");
  
    podiumData.forEach((data, index) => {
      const podiumPlace = podiumPlaces[index];
      podiumPlace.querySelector(".podium-position").textContent = `${index + 1}${["st", "nd", "rd"][index]}`;
      podiumPlace.querySelector(".driver-name").textContent = data.name;
      podiumPlace.querySelector(".constructor-name").textContent = data.constructor;
    });
  }
  
  // Example usage when loading race results
  updatePodium(raceResults);
  
});

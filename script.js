document.addEventListener("DOMContentLoaded", () => {
  const seasonSelect = document.getElementById("season-select");
  const viewRacesBtn = document.getElementById("view-races-btn");
  const raceViewMessage = document.getElementById("race-view-message");
  const raceList = document.getElementById("race-list");

  // Sample data for race results (mocked for now)
  const sampleResults = {
    qualifying: [
      { pos: 1, name: "Max Verstappen", constructor: "Red Bull", q1: "1:27.23", q2: "1:23.23", q3: "1:22.98" },
      { pos: 2, name: "Charles Leclerc", constructor: "Ferrari", q1: "1:27.35", q2: "1:23.56", q3: "1:23.12" },
    ],
    results: [
      { pos: 1, name: "Max Verstappen", constructor: "Red Bull", laps: 58, points: 25 },
      { pos: 2, name: "Charles Leclerc", constructor: "Ferrari", laps: 58, points: 18 },
      { pos: 3, name: "Lewis Hamilton", constructor: "Mercedes", laps: 58, points: 15 },
    ],
  };

  // Handle "View Races" button click
  viewRacesBtn.addEventListener("click", async () => {
    const selectedSeason = seasonSelect.value;

    if (!selectedSeason) {
      raceViewMessage.textContent = "No season selected";
      raceList.innerHTML = ""; // Clear the race list
      return;
    }

    try {
      const response = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${selectedSeason}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch race data.");
      }

      const races = await response.json();

      if (races.length === 0) {
        raceViewMessage.textContent = `No races found for the ${selectedSeason} season.`;
        raceList.innerHTML = "";
        return;
      }

      raceViewMessage.textContent = `Races for the ${selectedSeason} Season:`;

      raceList.innerHTML = ""; // Clear previous list
      races.forEach((race) => {
        const listItem = document.createElement("li");
        listItem.classList.add("content", "mb-4");

        listItem.innerHTML = `
          <div class="box">
            <div class="columns">
              <div class="column">
                <h2 class="title is-5">${race.name} (${race.date})</h2>
                <p><strong>Round:</strong> ${race.round}</p>
                <p><strong>Location:</strong> ${race.circuit.location}, ${race.circuit.country}</p>
                <p><strong>Circuit:</strong> <a href="${race.circuit.url}" target="_blank">${race.circuit.name}</a></p>
              </div>
              <div class="column is-narrow">
                <button class="button is-link view-results-btn" data-race-id="${race.id}">
                  View Results
                </button>
              </div>
            </div>
          </div>
        `;

        raceList.appendChild(listItem);
      });

      // Attach event listeners to "View Results" buttons
      document.querySelectorAll(".view-results-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const raceId = event.target.dataset.raceId;
          displayResults(raceId, sampleResults); // Use mocked data for now
        });
      });
    } catch (error) {
      console.error(error);
      raceViewMessage.textContent = "Failed to load race data. Please try again later.";
      raceList.innerHTML = "";
    }
  });

  // Function to display race results
  function displayResults(raceId, results) {
    raceList.innerHTML = ""; // Clear the race list

    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("box");

    resultsContainer.innerHTML = `
      <h1 class="title is-4">Results for Race ${raceId}</h1>
      <div class="columns">
        <!-- Qualifying Table -->
        <div class="column">
          <h2 class="title is-5">Qualifying Results</h2>
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Name</th>
                <th>Constructor</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
              </tr>
            </thead>
            <tbody>
              ${results.qualifying
                .map(
                  (q) =>
                    `<tr>
                      <td>${q.pos}</td>
                      <td>${q.name}</td>
                      <td>${q.constructor}</td>
                      <td>${q.q1}</td>
                      <td>${q.q2}</td>
                      <td>${q.q3}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Race Results Table -->
        <div class="column">
          <h2 class="title is-5">Race Results</h2>
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Name</th>
                <th>Constructor</th>
                <th>Laps</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              ${results.results
                .map(
                  (r) =>
                    `<tr>
                      <td>${r.pos}</td>
                      <td>${r.name}</td>
                      <td>${r.constructor}</td>
                      <td>${r.laps}</td>
                      <td>${r.points}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    raceList.appendChild(resultsContainer);
  }
});

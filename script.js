document.addEventListener("DOMContentLoaded", () => {
  const seasonSelect = document.getElementById("season-select");
  const viewRacesBtn = document.getElementById("view-races-btn");
  const raceViewMessage = document.getElementById("race-view-message");
  const raceList = document.getElementById("race-list");
  const qualifyingResults = document.getElementById("qualifying-results");
  const raceResults = document.getElementById("race-results");

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
          fetchAndDisplayResults(race.id); // Fetch and display results based on race id
        });
      });
    } catch (error) {
      console.error(error);
      raceViewMessage.textContent = "Failed to load data.";
    }
  });

  // Fetch and display the qualifying and race results for a given race ID
  async function fetchAndDisplayResults(raceId) {
    try {
      // Fetch qualifying results for the selected race
      const qualifyingResponse = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`);
      const qualifyingData = await qualifyingResponse.json();

      // Fetch race results for the selected race (assuming this URL exists for race results)
      const raceResponse = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`);
      const raceData = await raceResponse.json();

      // Display the results in the table
      displayResults(qualifyingData, raceData);
      updatePodium(raceData); // Update podium (top 3 positions)
    } catch (error) {
      console.error(error);
      raceResults.innerHTML = "<tr><td colspan='5'>Failed to load race results.</td></tr>";
      qualifyingResults.innerHTML = "<tr><td colspan='6'>Failed to load qualifying results.</td></tr>";
    }
  }

  // Function to display qualifying and race results in their respective tables
  function displayResults(qualifyingData, raceData) {
    // Display Qualifying Results
    qualifyingResults.innerHTML = qualifyingData
      .map(
        (q) => `<tr><td>${q.position}</td><td>${q.driver.forename} ${q.driver.surname}</td><td>${q.constructor.name}</td><td>${q.q1}</td><td>${q.q2}</td><td>${q.q3}</td></tr>`
      )
      .join("");

    // Display Race Results
    raceResults.innerHTML = raceData
      .map(
        (r) => `<tr><td>${r.position}</td><td>${r.driver.forename} ${r.driver.surname}</td><td>${r.constructor.name}</td><td>${r.laps}</td><td>${r.points}</td></tr>`
      )
      .join("");
  }

  // Function to update podium (top 3 positions)
  function updatePodium(raceResults) {
    const podiumData = raceResults.slice(0, 3); // Get the top 3 drivers
    const podiumPlaces = document.querySelectorAll(".podium-place");

    podiumData.forEach((data, index) => {
      const podiumPlace = podiumPlaces[index];
      podiumPlace.querySelector(".podium-position").textContent = `${index + 1}${["st", "nd", "rd"][index]}`;
      podiumPlace.querySelector(".driver-name").textContent = `${data.driver.forename} ${data.driver.surname}`;
      podiumPlace.querySelector(".constructor-name").textContent = data.constructor.name;
    });
  }
});

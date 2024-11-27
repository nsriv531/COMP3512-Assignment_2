document.addEventListener("DOMContentLoaded", () => {
  const seasonSelect = document.getElementById("season-select");
  const viewRacesBtn = document.getElementById("view-races-btn");
  const raceList = document.getElementById("race-list");
  const raceViewMessage = document.getElementById("race-view-message");
  const qualifyingResults = document.getElementById("qualifying-results");
  const raceResults = document.getElementById("race-results");

  // Modal elements for constructors
  const constructorModal = document.getElementById("constructor-modal");
  const closeModalButton = document.getElementById("close-modal");
  const constructorName = document.getElementById("constructor-name");
  const constructorNationality = document.getElementById("constructor-nationality");
  const constructorURL = document.getElementById("constructor-url");
  const constructorRaceResults = document.getElementById("constructor-race-results");

  // Function to open the modal
  function openModal() {
    constructorModal.classList.add("is-active");
  }

  // Function to close the modal
  function closeModal() {
    constructorModal.classList.remove("is-active");
  }

  closeModalButton.addEventListener("click", closeModal);

  // Handle "View Races" button click
  viewRacesBtn.addEventListener("click", async () => {
    const selectedSeason = seasonSelect.value;

    if (!selectedSeason) {
      raceViewMessage.textContent = "Please select a season.";
      raceList.innerHTML = "";
      return;
    }

    try {
      const response = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${selectedSeason}`
      );
      const races = await response.json();

      if (races.length === 0) {
        raceViewMessage.textContent = `No races found for the ${selectedSeason} season.`;
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

        // Add event listener to each "View Results" button
        listItem.querySelector(".view-results-btn").addEventListener("click", () => {
          fetchAndDisplayResults(race.id);
        });
      });
    } catch (error) {
      console.error(error);
      raceViewMessage.textContent = "Failed to load race data.";
    }
  });

  // Fetch and display the qualifying and race results for a given race ID
  async function fetchAndDisplayResults(raceId) {
    try {
      const qualifyingResponse = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`
      );
      const qualifyingData = await qualifyingResponse.json();

      const raceResponse = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`
      );
      const raceData = await raceResponse.json();

      displayResults(qualifyingData, raceData);
      updatePodium(raceData);
    } catch (error) {
      console.error("Error fetching results:", error);
      raceResults.innerHTML = "<tr><td colspan='5'>Failed to load race results.</td></tr>";
      qualifyingResults.innerHTML = "<tr><td colspan='6'>Failed to load qualifying results.</td></tr>";
    }
  }

  // Function to display qualifying and race results in their respective tables
  function displayResults(qualifyingData, raceData) {
    qualifyingResults.innerHTML = qualifyingData
      .map(
        (q) => `
          <tr>
            <td>${q.position}</td>
            <td>${q.driver.forename} ${q.driver.surname}</td>
            <td><a href="#" class="constructor-link" data-constructor-ref="${q.constructor.constructorRef}">${q.constructor.name}</a></td>
            <td>${q.q1 || "--"}</td>
            <td>${q.q2 || "--"}</td>
            <td>${q.q3 || "--"}</td>
          </tr>`
      )
      .join("");

    raceResults.innerHTML = raceData
      .map(
        (r) => `
          <tr>
            <td>${r.position}</td>
            <td>${r.driver.forename} ${r.driver.surname}</td>
            <td><a href="#" class="constructor-link" data-constructor-ref="${r.constructor.constructorRef}">${r.constructor.name}</a></td>
            <td>${r.laps}</td>
            <td>${r.points}</td>
          </tr>`
      )
      .join("");

    // Add event listeners for constructor links
    document.querySelectorAll(".constructor-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const constructorRef = event.target.getAttribute("data-constructor-ref");
        const season = seasonSelect.value;
        fetchConstructorDetails(constructorRef, season);
      });
    });
  }

  // Update podium (top 3 positions)
  function updatePodium(raceResults) {
    const podiumData = raceResults.slice(0, 3);
    const podiumPlaces = document.querySelectorAll(".podium-place");

    podiumData.forEach((data, index) => {
      const podiumPlace = podiumPlaces[index];
      podiumPlace.querySelector(".podium-position").textContent = `${index + 1}${["st", "nd", "rd"][index]}`;
      podiumPlace.querySelector(".driver-name").textContent = `${data.driver.forename} ${data.driver.surname}`;
      podiumPlace.querySelector(".constructor-name").textContent = data.constructor.name;
    });
  }

  // Fetch constructor details and display them in the modal
  async function fetchConstructorDetails(constructorRef, season) {
    try {
      // Log API URL for debugging
      console.log(`API URL: https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?constructor=${constructorRef}&season=${season}`);
      
      const response = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?constructor=${constructorRef}&season=${season}`
      );
      const resultsData = await response.json();
  
      // Log the API response
      console.log("Constructor API Response:", resultsData);
  
      // Handle API errors
      if (resultsData.error) {
        console.error("API Error:", resultsData.error.message);
        constructorRaceResults.innerHTML = `<tr><td colspan='4'>Error: ${resultsData.error.message}</td></tr>`;
        openModal();
        return;
      }
  
      // Validate the response structure
      if (!resultsData || resultsData.length === 0 || !resultsData[0]?.constructor) {
        console.error("Invalid or missing constructor data:", resultsData);
        constructorRaceResults.innerHTML = "<tr><td colspan='4'>No data available for this constructor.</td></tr>";
        openModal();
        return;
      }
  
      // Populate modal with constructor details
      constructorName.textContent = resultsData[0].constructor.name;
      constructorNationality.textContent = resultsData[0].constructor.nationality;
      constructorURL.innerHTML = `<a href="${resultsData[0].constructor.url}" target="_blank">${resultsData[0].constructor.url}</a>`;
  
      // Populate race results in the modal
      constructorRaceResults.innerHTML = resultsData
        .map(
          (r) => `
            <tr>
              <td>${r.round}</td>
              <td>${r.race.name}</td>
              <td>${r.points}</td>
              <td>${r.position}</td>
            </tr>`
        )
        .join("");
  
      // Open the modal
      openModal();
    } catch (error) {
      console.error("Failed to fetch constructor details:", error);
      constructorRaceResults.innerHTML = "<tr><td colspan='4'>Failed to load constructor data.</td></tr>";
      openModal();
    }
  }
});

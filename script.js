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

  // Modal elements for drivers
  const driverModal = document.getElementById("driver-modal");
  const closeDriverModalButton = document.getElementById("close-driver-modal");
  const driverName = document.getElementById("driver-name");
  const driverNationality = document.getElementById("driver-nationality");
  const driverDob = document.getElementById("driver-dob");
  const driverURL = document.getElementById("driver-url");

  // Functions to open and close modals
  function openModal(modal) {
    modal.classList.add("is-active");
  }

  function closeModal(modal) {
    modal.classList.remove("is-active");
  }

  closeModalButton.addEventListener("click", () => closeModal(constructorModal));
  closeDriverModalButton.addEventListener("click", () => closeModal(driverModal));

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

  // Fetch and display results
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
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }

  // Display qualifying and race results
  function displayResults(qualifyingData, raceData) {
    qualifyingResults.innerHTML = qualifyingData
      .map(
        (q) => `
          <tr>
            <td>${q.position}</td>
            <td><a href="#" class="driver-link" data-driver-id="${q.driver.driverId}">${q.driver.forename} ${q.driver.surname}</a></td>
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
            <td><a href="#" class="driver-link" data-driver-id="${r.driver.driverId}">${r.driver.forename} ${r.driver.surname}</a></td>
            <td><a href="#" class="constructor-link" data-constructor-ref="${r.constructor.constructorRef}">${r.constructor.name}</a></td>
            <td>${r.laps}</td>
            <td>${r.points}</td>
          </tr>`
      )
      .join("");

    document.querySelectorAll(".constructor-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const constructorRef = link.getAttribute("data-constructor-ref");
        fetchConstructorDetails(constructorRef, seasonSelect.value);
      });
    });

    document.querySelectorAll(".driver-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const driverId = link.getAttribute("data-driver-id");
        fetchDriverDetails(driverId);
      });
    });
  }

  // Fetch constructor details
  async function fetchConstructorDetails(constructorRef, season) {
    try {
      if (!constructorRef || !season) {
        console.error("Missing constructor reference or season.");
        return;
      }
  
      const response = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?constructor=${constructorRef}&season=${season}`
      );
  
      if (!response.ok) {
        console.error("Failed to fetch constructor data:", response.statusText);
        return;
      }
  
      const data = await response.json();
  
      if (!data.length) {
        console.error("No constructor data available.");
        constructorName.textContent = "No data found";
        constructorRaceResults.innerHTML = "<tr><td colspan='4'>No results available</td></tr>";
        openModal(constructorModal);
        return;
      }
  
      const constructor = data[0]?.constructor;
  
      constructorName.textContent = constructor?.name || "Unknown";
      constructorNationality.textContent = constructor?.nationality || "Unknown";
      constructorURL.innerHTML = `<a href="${constructor?.url}" target="_blank">${constructor?.url || "No website available"}</a>`;
      constructorRaceResults.innerHTML = data
        .map(
          (result) => `
          <tr>
            <td>${result.round}</td>
            <td>${result.race?.name || "N/A"}</td>
            <td>${result.points || "0"}</td>
            <td>${result.position || "N/A"}</td>
          </tr>`
        )
        .join("");
  
      openModal(constructorModal);
    } catch (error) {
      console.error("Error fetching constructor data:", error);
      constructorName.textContent = "Error loading constructor details";
      constructorRaceResults.innerHTML = "<tr><td colspan='4'>Unable to load data</td></tr>";
      openModal(constructorModal);
    }
  }

  // Fetch driver details
  async function fetchDriverDetails(driverId) {
    try {
      const response = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?driverId=${driverId}`
      );
      const driver = await response.json();

      driverName.textContent = `${driver[0]?.forename} ${driver[0]?.surname}`;
      driverNationality.textContent = driver[0]?.nationality || "Unknown";
      driverDob.textContent = driver[0]?.dateOfBirth || "Unknown";
      driverURL.innerHTML = `<a href="${driver[0]?.url}" target="_blank">Biography</a>`;

      openModal(driverModal);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  }
});

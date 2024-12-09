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

const circuitModal = document.getElementById("circuit-modal");
const closeCircuitModalButton = document.getElementById("close-circuit-modal");
const circuitName = document.getElementById("circuit-name");
const circuitLocation = document.getElementById("circuit-location");
const circuitCountry = document.getElementById("circuit-country");
const circuitURL = document.getElementById("circuit-url");
const circuitImage = document.getElementById("circuit-image");

// Close the circuit modal
closeCircuitModalButton.addEventListener("click", () => closeModal(circuitModal));

// Fetch and display circuit details
async function fetchCircuitDetails(circuitRef) {
  try {
    const response = await fetch(
      `https://www.randyconnolly.com/funwebdev/3rd/api/f1/circuits.php?id=${circuitRef}`
    );
    const circuit = await response.json();
    console.log(circuit);
    // Assuming circuit data is an array, take the first element
    const circuitData = Array.isArray(circuit) ? circuit[0] : circuit;

    circuitName.textContent = circuitData.name || "Unknown";
    circuitLocation.textContent = circuitData.location || "Unknown";
    circuitCountry.textContent = circuitData.country || "Unknown";
    circuitURL.innerHTML = circuitData.url
      ? `<a href="${circuitData.url}" target="_blank">${circuitData.url}</a>`
      : "No website available";
    circuitImage.src = circuitData.image || "default-image.png"; // Use a default image if none is provided

    openModal(circuitModal);
  } catch (error) {
    console.error("Error fetching circuit details:", error);
  }
}

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
      let races;
  
      // Check local storage for existing data
      const storedData = localStorage.getItem(`races_${selectedSeason}`);
      if (storedData) {
        races = JSON.parse(storedData);
        console.log(`Retrieved races for ${selectedSeason} from local storage.`);
      } else {
        // Fetch races data if not in local storage
        const response = await fetch(
          `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${selectedSeason}`
        );
        races = await response.json();
  
        // Save the fetched data to local storage
        localStorage.setItem(`races_${selectedSeason}`, JSON.stringify(races));
        console.log(`Fetched and saved races for ${selectedSeason} to local storage.`);
      }
  
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
          console.log(race.id);
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

      const raceDetailsResponse = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?id=${raceId}`
      );
      const raceDetails = await raceDetailsResponse.json();
      console.log(raceDetails);

      const qualifyingResponse = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`
      );
      const qualifyingData = await qualifyingResponse.json();

      const raceResponse = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`
      );
      const raceData = await raceResponse.json();


      displayRaceDetails(raceDetails);
      displayResults(qualifyingData, raceData);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }

  function displayRaceDetails(race) {
    const raceDetailsContainer = document.getElementById("race-details");
  
    // Check if race is an array
    if (Array.isArray(race) && race.length > 0) {
      race = race[0]; // Use the first item if it's an array
    }
  
    raceDetailsContainer.innerHTML = `
      <h2 class="title">Results for ${race.name || "N/A"}</h2>
      <p><strong>Round:</strong> ${race.round || "N/A"}</p>
      <p><strong>Year:</strong> ${race.year || "N/A"}</p>
      <p>
        <strong>Circuit:</strong> 
        <a href="#" class="circuit-link" data-circuit-ref="${race.circuit.id}">
          ${race.circuit.name} (${race.circuit.location}, ${race.circuit.country})
        </a>
      </p>
      <p><strong>Date:</strong> ${race.date || "N/A"}</p>
      <p><strong>URL:</strong> <a href="${race.url || "#"}" target="_blank">${race.url || "N/A"}</a></p>
    `;
  
    // Add event listener to the circuit link
    const circuitLink = raceDetailsContainer.querySelector(".circuit-link");
    if (circuitLink) {
      circuitLink.addEventListener("click", (event) => {
        event.preventDefault();
        const circuitRef = circuitLink.getAttribute("data-circuit-ref");
        console.log(circuitRef);
        fetchCircuitDetails(circuitRef);
      });
    }
  }

  // Display qualifying and race results
  function displayResults(qualifyingData, raceData) {
    qualifyingResults.innerHTML = qualifyingData
      .map((q) => {
        const constructorRef = q.constructor.ref || "N/A"; // Fallback to "N/A" if undefined
        return `
          <tr>
            <td>${q.position}</td>
            <td><a href="#" class="driver-link" data-driver-id="${q.driver.ref}">${q.driver.forename} ${q.driver.surname}</a></td>
            <td>
              <a href="#" class="constructor-link" data-constructor-ref="${constructorRef}">${q.constructor.name}</a>
            </td>
            <td>${q.q1 || "--"}</td>
            <td>${q.q2 || "--"}</td>
            <td>${q.q3 || "--"}</td>
          </tr>`;
      })
      .join("");
  
    raceResults.innerHTML = raceData
      .map((r) => {
        const constructorRef = r.constructor.ref || "N/A"; // Fallback to "N/A" if undefined
        return `
          <tr>
            <td>${r.position}</td>
            <td><a href="#" class="driver-link" data-driver-id="${r.driver.ref}">${r.driver.forename} ${r.driver.surname}</a></td>
            <td>
              <a href="#" class="constructor-link" data-constructor-ref="${constructorRef}">${r.constructor.name}</a>
            </td>
            <td>${r.laps}</td>
            <td>${r.points}</td>
          </tr>`;
      })
      .join("");
  
    // Update the podium
    updatePodium(raceData);
  
    // Add event listeners for constructor links
    document.querySelectorAll(".constructor-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const constructorRef = link.getAttribute("data-constructor-ref");
        if (constructorRef) fetchConstructorDetails(constructorRef, seasonSelect.value);
      });
    });
  
    // Add event listeners for driver links
    document.querySelectorAll(".driver-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const driverId = link.getAttribute("data-driver-id");
        if (driverId) fetchDriverDetails(driverId);
      });
    });
  }
  
  
  function updatePodium(raceData) {
    // Get the top 3 results
    const podiumResults = raceData.slice(0, 3); // Top 3 drivers only
    const podiumPlaces = document.querySelectorAll(".podium-place");
  
    // Map the podium results to each podium place
    podiumResults.forEach((result, index) => {
      const podiumPlace = podiumPlaces[index];
      const driverNameElement = podiumPlace.querySelector(".driver-name");
      const constructorNameElement = podiumPlace.querySelector(".constructor-name");
  
      driverNameElement.textContent = `${result.driver.forename} ${result.driver.surname}`;
      constructorNameElement.textContent = result.constructor.name;
    });
  }

  // Fetch constructor details
  async function fetchConstructorDetails(constructorRef, season) {
    try {
        if (!constructorRef || !season) {
            console.error("Missing constructor reference or season.");
            return;
        }

        // Fetch constructor race results
        const response = await fetch(
            `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructorResults.php?constructor=${constructorRef}&season=${season}`
        );

        // Fetch additional constructor details
        const responsede = await fetch(
            `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?ref=${constructorRef}`
        );

        if (!response.ok || !responsede.ok) {
            console.error("Failed to fetch constructor data:", response.statusText, responsede.statusText);
            return;
        }

        const data = await response.json();
        const otherData = await responsede.json(); // Additional constructor details
        console.log("Constructor Data Response:", data);
        console.log("Additional Constructor Data:", otherData);

        // Handle API error responses
        if (data.error || !Array.isArray(data)) {
            console.error("API Error or unexpected data format:", data.error);
            constructorName.textContent = "Error loading constructor details";
            constructorRaceResults.innerHTML = "<tr><td colspan='4'>Unable to load data</td></tr>";
            openModal(constructorModal);
            return;
        }

        // Sort results by round
        data.sort((a, b) => a.round - b.round);

        // Update modal with fetched constructor details
        constructorName.textContent = otherData.name || "Unknown";
        constructorNationality.textContent = otherData.nationality || "Unknown";
        constructorURL.innerHTML = `<a href="${otherData.url}" target="_blank">${otherData.url || "No website available"}</a>`;

        // Map over the race results data to create table rows
        constructorRaceResults.innerHTML = data
            .map(
                (result) => `
                <tr>
                    <td>${result.round}</td>
                    <td>${result.name || "N/A"}</td>
                    <td>${result.points || "0"}</td>
                    <td>${result.positionOrder || "N/A"}</td>
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
  async function fetchDriverDetails(driverRef) {
    try {
        // Fetch driver details
        const driverResponse = await fetch(
            `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref=${driverRef}`
        );
        const driver = await driverResponse.json();

        // Debugging logs
        console.log("Driver Ref:", driverRef);
        console.log("API Response:", driver);

        if (!driver || Object.keys(driver).length === 0) {
            throw new Error("Driver not found");
        }

        // Set driver details in modal
        driverName.textContent = `${driver.forename} ${driver.surname}`;
        driverNationality.textContent = driver.nationality || "Unknown";
        driverDob.textContent = driver.dob || "Unknown"; // 'dob' property
        driverURL.innerHTML = `<a href="${driver.url}" target="_blank">Biography</a>`;

        // Fetch race results for the driver
        const selectedSeason = document.getElementById("season-select").value; // Get the selected season
        const raceResultsResponse = await fetch(
            `https://www.randyconnolly.com/funwebdev/3rd/api/f1/driverResults.php?driver=${driverRef}&season=${selectedSeason}`
        );
        const raceResults = await raceResultsResponse.json();

        // Debugging logs
        console.log("Driver Race Results:", raceResults);

        // Populate race results in the modal
        const driverRaceResults = document.getElementById("driver-race-results");
        if (raceResults.length > 0) {
            driverRaceResults.innerHTML = raceResults
                .map(
                    (result) => `
                    <tr>
                        <td>${result.round}</td>
                        <td>${result.name || "N/A"}</td>
                        <td>${result.positionOrder || "N/A"}</td>
                        <td>${result.points || 0}</td>
                    </tr>`
                )
                .join("");
        } else {
            driverRaceResults.innerHTML = `<tr><td colspan="4">No race results available</td></tr>`;
        }

        openModal(driverModal);
    } catch (error) {
        console.error("Error fetching driver data:", error);

        // Set error message in the modal
        driverName.textContent = "Error loading driver details";
        driverNationality.textContent = "Unknown";
        driverDob.textContent = "Unknown";
        driverURL.innerHTML = "No biography available";
        const driverRaceResults = document.getElementById("driver-race-results");
        driverRaceResults.innerHTML = `<tr><td colspan="4">Unable to load race results</td></tr>`;

        openModal(driverModal);
    }
}
});

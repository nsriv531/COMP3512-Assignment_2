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
      `https://www.randyconnolly.com/funwebdev/3rd/api/f1/circuits.php?ref=${circuitRef}`
    );
    const circuit = await response.json();

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
      <p><strong>Year:</strong> ${race.season || "N/A"}</p>
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
    console.log(qualifyingData);
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
  
    // Add event listeners for constructor links
    document.querySelectorAll(".constructor-link").forEach((link) => {
  console.log("Constructor Link Found:", link); // Debug
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const constructorRef = link.getAttribute("data-constructor-ref");
    console.log("Clicked Constructor Ref:", constructorRef); // Debug
    if (constructorRef && constructorRef !== "N/A") {
      fetchConstructorDetails(constructorRef, seasonSelect.value);
    } else {
      alert("Constructor details are not available.");
    }
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

        console.log(constructorRef);
        console.log(season);
        if (!response.ok) {
            console.error("Failed to fetch constructor data:", response.statusText);
            return;
        }

        const data = await response.json();

        // Log the data for debugging
        console.log("Constructor Data Response:", data);

        // Handle API error response
        if (data.error) {
            console.error("API Error:", data.error);
            constructorName.textContent = "Error loading constructor details";
            constructorRaceResults.innerHTML = "<tr><td colspan='4'>Unable to load data</td></tr>";
            openModal(constructorModal);
            return;
        }

        // Check if data is an array
        if (!Array.isArray(data)) {
            console.error("Constructor data is not an array");
            constructorName.textContent = "Error loading constructor details";
            constructorRaceResults.innerHTML = "<tr><td colspan='4'>Unable to load data</td></tr>";
            openModal(constructorModal);
            return;
        }

        // Sort the results by round
        data.sort((a, b) => a.round - b.round);

        // Extract constructor details from the first item
        const constructor = data[0]?.constructor;

        constructorName.textContent = constructor?.name || "Unknown";
        constructorNationality.textContent = constructor?.nationality || "Unknown";
        constructorURL.innerHTML = `<a href="${constructor?.url}" target="_blank">${constructor?.url || "No website available"}</a>`;

        // Map over the data to create table rows
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
      const response = await fetch(
        `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?ref=${driverRef}`
      );
      const driver = await response.json();
  
      // Debugging logs
      console.log("Driver Ref:", driverRef);
      console.log("API Response:", driver);
  
      if (driver.length === 0) {
        throw new Error("Driver not found");
      }
  
      driverName.textContent = `${driver[0]?.forename} ${driver[0]?.surname}`;
      driverNationality.textContent = driver[0]?.nationality || "Unknown";
      driverDob.textContent = driver[0]?.dob || "Unknown"; // Check for 'dob' instead of 'dateOfBirth'
      driverURL.innerHTML = `<a href="${driver[0]?.url}" target="_blank">Biography</a>`;
  
      openModal(driverModal);
    } catch (error) {
      console.error("Error fetching driver data:", error);
      driverName.textContent = "Error loading driver details";
      driverNationality.textContent = "Unknown";
      driverDob.textContent = "Unknown";
      driverURL.innerHTML = "No biography available";
      openModal(driverModal);
    }
  }
});

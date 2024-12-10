document.addEventListener("DOMContentLoaded", () => {
const seasonSelect = document.getElementById("season-select");
const viewRacesBtn = document.getElementById("view-races-btn");
const raceList = document.getElementById("race-list");
const raceViewMessage = document.getElementById("race-view-message");
const qualifyingResults = document.getElementById("qualifying-results");
const raceResults = document.getElementById("race-results");

  // Modal elements for constructors
  const logo = document.querySelector(".navbar-item img"); // Select the logo

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
const driverage = document.getElementById("driver-age");
const driverNationality = document.getElementById("driver-nationality");
const driverDob = document.getElementById("driver-dob");
const driverURL = document.getElementById("driver-url");

const circuitModal = document.getElementById("circuit-modal");
const closeCircuitModalButton = document.getElementById("close-circuit-modal");
const circuitName = document.getElementById("circuit-name");
const circuitLocation = document.getElementById("circuit-location");
const circuitCountry = document.getElementById("circuit-country");
const circuitURL = document.getElementById("circuit-url");

const favoritesModal = document.getElementById("favorites-modal");
const favoritesList = document.getElementById("favorites-list");
const showFavoritesButton = document.getElementById("showfavorites");
const closeFavoritesModal = document.getElementById("close-favorites-modal");

const homeSection = document.getElementById("home");
const raceViewSection = document.getElementById("race-view");
const homeButton = document.getElementById("homebutton"); // Home button in navbar

homeButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default behavior of anchor
  homeSection.classList.replace("hidden", "visible");
  raceViewSection.classList.replace("visible", "hidden");
});

logo.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default behavior (if any)

  // Show the home view and hide other views
  homeSection.classList.add("visible");
  homeSection.classList.remove("hidden");
  raceViewSection.classList.add("hidden");
  raceViewSection.classList.remove("visible");

  // Optionally scroll to the top of the home section
  homeView.scrollIntoView({ behavior: "smooth" });
});
  // Event listener to open the favorites modal
  function populateFavoritesList() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesList.innerHTML = ""; // Clear the current list
  
    if (favorites.length === 0) {
      favoritesList.innerHTML = "<li class='has-text-centered'>No favorites added yet.</li>";
    } else {
      favorites.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("list-item"); // Add Bulma styling class
        li.innerHTML = `
          <span>${item.type}: ${item.name}</span>
          <button data-index="${index}" class="remove-favorite-button button is-small is-danger is-light">Remove</button>
        `;
        favoritesList.appendChild(li);
  
        // Add event listener to the remove button
        li.querySelector(".remove-favorite-button").addEventListener("click", () => {
          removeFavorite(index);
        });
      });
    }
  }

  // Function to remove a favorite from localStorage
  function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1); // Remove the selected favorite
    localStorage.setItem("favorites", JSON.stringify(favorites));
    populateFavoritesList(); // Refresh the list
  }

  // Event listener to show the favorites modal
  showFavoritesButton.addEventListener("click", () => {
    populateFavoritesList();
    favoritesModal.classList.add("is-active");
  });

  // Event listener to close the favorites modal
  closeFavoritesModal.addEventListener("click", () => {
    favoritesModal.classList.remove("is-active");
  });

  // Event listener to close modal when clicking outside content
  document.querySelector(".modal-background").addEventListener("click", () => {
    favoritesModal.classList.remove("is-active");
  });
// Close the circuit modal
closeCircuitModalButton.addEventListener("click", () => closeModal(circuitModal));

// Event listener for "Add to Favorites" buttons
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-favorites-btn")) {
    const type = event.target.dataset.type;
    let name;

    if (type === "constructor") {
      name = document.getElementById("constructor-name").textContent;
    } else if (type === "driver") {
      name = document.getElementById("driver-name").textContent;
    }

    if (name) {
      addToFavorites({ type, name });
      alert(`${type} "${name}" added to favorites!`);
    }
  }
});

// Function to add an item to favorites
function addToFavorites(item) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(item);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

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

      // Set circuit details in the modal
      circuitName.textContent = circuitData.name || "Unknown";
      circuitLocation.textContent = circuitData.location || "Unknown";
      circuitCountry.textContent = circuitData.country || "Unknown";
      circuitURL.innerHTML = circuitData.url
          ? `<a href="${circuitData.url}" target="_blank">${circuitData.url}</a>`
          : "No website available";

      // Add "Add to Favorites" button
      const addToFavoritesButton = document.createElement("button");
      addToFavoritesButton.textContent = "Add to Favorites";
      addToFavoritesButton.classList.add("button", "is-link", "add-to-favorites-btn");
      addToFavoritesButton.dataset.type = "circuit";
      addToFavoritesButton.dataset.name = circuitData.name || "Unknown";
      addToFavoritesButton.addEventListener("click", () => {
          addToFavorites({
              type: "Circuit",
              name: circuitData.name || "Unknown"
          });
          alert(`Circuit "${circuitData.name || "Unknown"}" added to favorites!`);
      });

      // Add the button to the modal
      const circuitModalContent = circuitModal.querySelector(".box");
      if (!circuitModalContent.querySelector(".add-to-favorites-btn")) {
          circuitModalContent.appendChild(addToFavoritesButton);
      }

      openModal(circuitModal);
  } catch (error) {
      console.error("Error fetching circuit details:", error);

      // Set error message in the modal
      circuitName.textContent = "Error loading circuit details";
      circuitLocation.textContent = "Unknown";
      circuitCountry.textContent = "Unknown";
      circuitURL.innerHTML = "No website available";

      openModal(circuitModal);
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


  homeSection.classList.add("visible");
raceViewSection.classList.add("hidden");

// Handle "View Races" button click
viewRacesBtn.addEventListener("click", async () => {
  const selectedSeason = seasonSelect.value;
  const loadingSpinner = document.getElementById("loading-spinner");

  if (!selectedSeason) {
    raceViewMessage.textContent = "Please select a season.";
    raceList.innerHTML = "";
    return;
  }

  try {
    loadingSpinner.style.display = "block"; // Show the spinner
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
      loadingSpinner.style.display = "none"; // Hide the spinner
      return;
    }

    // Hide the home section and display the race view section
    homeSection.classList.replace("visible", "hidden");
    raceViewSection.classList.replace("hidden", "visible");

    // Populate the race view
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

    loadingSpinner.style.display = "none"; // Hide the spinner
  } catch (error) {
    console.error(error);
    raceViewMessage.textContent = "Failed to load race data.";
    loadingSpinner.style.display = "none"; // Hide the spinner
  }
});


  // Fetch and display results
  async function fetchAndDisplayResults(raceId) {
    try {
      let qualifyingData, raceData, raceDetails;
  
      // Check local storage for race details
      const raceDetailsKey = `race_details_${raceId}`;
      const storedRaceDetails = localStorage.getItem(raceDetailsKey);
      if (storedRaceDetails) {
        raceDetails = JSON.parse(storedRaceDetails);
        console.log(`Retrieved race details for ${raceId} from local storage.`);
      } else {
        const raceDetailsResponse = await fetch(
          `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?id=${raceId}`
        );
        raceDetails = await raceDetailsResponse.json();
        localStorage.setItem(raceDetailsKey, JSON.stringify(raceDetails));
        console.log(`Fetched and saved race details for ${raceId} to local storage.`);
      }
  
      // Check local storage for qualifying data
      const qualifyingKey = `qualifying_${raceId}`;
      const storedQualifyingData = localStorage.getItem(qualifyingKey);
      if (storedQualifyingData) {
        qualifyingData = JSON.parse(storedQualifyingData);
        console.log(`Retrieved qualifying data for ${raceId} from local storage.`);
      } else {
        const qualifyingResponse = await fetch(
          `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`
        );
        qualifyingData = await qualifyingResponse.json();
        localStorage.setItem(qualifyingKey, JSON.stringify(qualifyingData));
        console.log(`Fetched and saved qualifying data for ${raceId} to local storage.`);
      }
  
      // Check local storage for race results
      const raceKey = `race_results_${raceId}`;
      const storedRaceData = localStorage.getItem(raceKey);
      if (storedRaceData) {
        raceData = JSON.parse(storedRaceData);
        console.log(`Retrieved race results for ${raceId} from local storage.`);
      } else {
        const raceResponse = await fetch(
          `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`
        );
        raceData = await raceResponse.json();
        localStorage.setItem(raceKey, JSON.stringify(raceData));
        console.log(`Fetched and saved race results for ${raceId} to local storage.`);
      }
  
      // Display data
      displayRaceDetails(raceDetails);
      displayResults(qualifyingData, raceData);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }
  
  // Display race details
  function displayRaceDetails(race) {
    const raceDetailsContainer = document.getElementById("race-details");
  
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
        fetchCircuitDetails(circuitRef);
      });
    }
  }
  
  // Display qualifying and race results
  function displayResults(qualifyingData, raceData) {
    // Populate Qualifying Results Table
    qualifyingResults.innerHTML = qualifyingData
    .map((q) => {
      const constructorRef = q.constructor.ref || "N/A";
      return `
        <tr>
          <td data-field="position">${q.position}</td>
          <td data-field="name"><a href="#" class="driver-link" data-driver-id="${q.driver.ref}">${q.driver.forename} ${q.driver.surname}</a></td>
          <td data-field="constructor"><a href="#" class="constructor-link" data-constructor-ref="${constructorRef}">${q.constructor.name}</a></td>
          <td data-field="q1">${q.q1 || "--"}</td>
          <td data-field="q2">${q.q2 || "--"}</td>
          <td data-field="q3">${q.q3 || "--"}</td>
        </tr>`;
    })
    .join("");
  
    raceResults.innerHTML = raceData
    .map((r) => {
      const constructorRef = r.constructor.ref || "N/A";
      return `
        <tr>
          <td data-field="position">${r.position}</td>
          <td data-field="name"><a href="#" class="driver-link" data-driver-id="${r.driver.ref}">${r.driver.forename} ${r.driver.surname}</a></td>
          <td data-field="constructor"><a href="#" class="constructor-link" data-constructor-ref="${constructorRef}">${r.constructor.name}</a></td>
          <td data-field="laps">${r.laps}</td>
          <td data-field="points">${r.points}</td>
        </tr>`;
    })
    .join("");
  
    updatePodium(raceData);
    // Ensure headers are clickable and sorting works
    enableTableSorting();
  
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
  
  document.addEventListener("click", (event) => {
    // Handle driver links
    if (event.target.classList.contains("driver-link")) {
      event.preventDefault();
      const driverId = event.target.getAttribute("data-driver-id");
      if (driverId) fetchDriverDetails(driverId);
    }
  
    // Handle constructor links
    if (event.target.classList.contains("constructor-link")) {
      event.preventDefault();
      const constructorRef = event.target.getAttribute("data-constructor-ref");
      if (constructorRef) fetchConstructorDetails(constructorRef, seasonSelect.value);
    }
  });

  
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

        // Calculate age based on DOB
        let age = "Unknown";
        if (driver.dob) {
            const birthYear = parseInt(driver.dob.split("-")[0], 10);
            age = new Date().getFullYear() - birthYear;
        }

        // Set driver details in modal
        driverName.textContent = `${driver.forename} ${driver.surname}`;
        driverage.textContent = age;
        driverNationality.textContent = driver.nationality || "Unknown";
        driverDob.textContent = driver.dob || "Unknown"; // 'dob' property
        driverURL.innerHTML = driver.url 
            ? `<a href="${driver.url}" target="_blank">Biography</a>` 
            : "No biography available";

        // Add "Add to Favorites" button
        const addToFavoritesButton = document.createElement("button");
        addToFavoritesButton.textContent = "Add to Favorites";
        addToFavoritesButton.classList.add("button", "is-link", "add-to-favorites-btn");
        addToFavoritesButton.dataset.type = "driver";
        addToFavoritesButton.dataset.name = `${driver.forename} ${driver.surname}`;
        addToFavoritesButton.addEventListener("click", () => {
            addToFavorites({
                type: "Driver",
                name: `${driver.forename} ${driver.surname}`
            });
            alert(`Driver "${driver.forename} ${driver.surname}" added to favorites!`);
        });

        // Add the button to the modal
        const driverModalContent = driverModal.querySelector(".box");
        if (!driverModalContent.querySelector(".add-to-favorites-btn")) {
            driverModalContent.appendChild(addToFavoritesButton);
        }

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

        // Open the modal
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

        // Open the modal with error details
        openModal(driverModal);
    }
}


function clearAllFavorites() {
  localStorage.removeItem("favorites"); // Remove all favorites from localStorage
  populateFavoritesList(); // Refresh the favorites list
  alert("All favorites have been cleared!"); // Notify the user
}

// Add event listener to Clear All Favorites button
const clearFavoritesButton = document.getElementById("clear-favorites-btn");
if (clearFavoritesButton) {
  clearFavoritesButton.addEventListener("click", clearAllFavorites);
}

function sortTable(tableBody, sortBy, ascending) {
  const rows = Array.from(tableBody.rows);
  rows.sort((a, b) => {
    const cellA = a.querySelector(`[data-field="${sortBy}"]`).textContent.trim();
    const cellB = b.querySelector(`[data-field="${sortBy}"]`).textContent.trim();

    const valueA = isNaN(cellA) ? cellA.toLowerCase() : parseFloat(cellA);
    const valueB = isNaN(cellB) ? cellB.toLowerCase() : parseFloat(cellB);

    if (valueA < valueB) return ascending ? -1 : 1;
    if (valueA > valueB) return ascending ? 1 : -1;
    return 0;
  });

  rows.forEach((row) => tableBody.appendChild(row));
}

// Attach click events to headers for sorting
function enableTableSorting() {
  document.querySelectorAll("th[data-sort]").forEach((header) => {
    let ascending = true; // Default sorting direction

    header.addEventListener("click", () => {
      const tableBody = header.closest("table").querySelector("tbody");
      const sortBy = header.getAttribute("data-sort");

      sortTable(tableBody, sortBy, ascending);
      ascending = !ascending; // Toggle sorting direction

      // Optional: Update visual indication of sorting
      document.querySelectorAll("th[data-sort]").forEach((h) => {
        h.classList.remove("ascending", "descending");
      });
      header.classList.add(ascending ? "ascending" : "descending");
    });
  });
}

const clearStorageButton = document.getElementById("clear-storage-btn");

    // Event listener to clear all local storage
    clearStorageButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all stored data? This action cannot be undone.")) {
            localStorage.clear(); // Clear all local storage
            alert("All local storage data has been cleared!");
            location.reload(); // Optionally reload the page to refresh the UI
        }
    });

enableTableSorting();

});
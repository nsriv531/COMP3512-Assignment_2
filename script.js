document.addEventListener('DOMContentLoaded', () => {
    const seasonSelect = document.getElementById('season-select');
    const viewRacesBtn = document.getElementById('view-races-btn');
    const raceViewMessage = document.getElementById('race-view-message');
    const raceList = document.getElementById('race-list');
  
    // Example race data
    const raceData = {
      2020: ['Race 1', 'Race 2', 'Race 3'],
      2021: ['Race A', 'Race B', 'Race C'],
      2022: ['Race X', 'Race Y', 'Race Z'],
      2023: ['Grand Prix 1', 'Grand Prix 2', 'Grand Prix 3'],
    };
  
    // Handle "View Races" button click
    viewRacesBtn.addEventListener('click', () => {
      const selectedSeason = seasonSelect.value;
  
      if (!selectedSeason) {
        // If no season is selected, show a message
        raceViewMessage.textContent = 'No season selected';
        raceList.innerHTML = ''; // Clear the race list
        return;
      }
  
      // If a season is selected, update the message and populate race data
      raceViewMessage.textContent = `Races for the ${selectedSeason} Season:`;
      raceList.innerHTML = ''; // Clear previous list
  
      raceData[selectedSeason].forEach(race => {
        const listItem = document.createElement('li');
        listItem.textContent = race;
        listItem.classList.add('content');
        raceList.appendChild(listItem);
      });
    });
  });
  
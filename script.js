const trackBtn = document.getElementById('trackBtn');
const ipInput = document.getElementById('ipInput');
const ipDisplay = document.getElementById('ip');
const locationDisplay = document.getElementById('location');
const ispDisplay = document.getElementById('isp');
const timezoneDisplay = document.getElementById('timezone');

// Initialize map
let map = L.map('map').setView([0, 0], 2); // Default world view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Fetch IP details
async function fetchIPDetails(ip = '') {
  const apiKey = 'at_4uOtKXljb7s6aVErS4tPZNkWgJdqv'; // Replace with your ipify API key
  const url = ip
    ? `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`
    : `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    displayResults(data);
    updateMap(data.location.lat, data.location.lng);
  } catch (error) {
    console.error('Error:', error);
    alert('Unable to fetch IP details.');
  }
}

// Display results
function displayResults(data) {
  ipDisplay.textContent = data.ip;
  locationDisplay.textContent = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
  ispDisplay.textContent = data.isp;
  timezoneDisplay.textContent = `UTC ${data.location.timezone}`;
}

// Update map view
function updateMap(lat, lng) {
  map.setView([lat, lng], 13); // Center map on the location
  L.marker([lat, lng]).addTo(map);
}

// Handle map clicks
map.on('click', async (e) => {
  const { lat, lng } = e.latlng;
  const apiKey = 'at_4uOtKXljb7s6aVErS4tPZNkWgJdqv'; // Replace with your API key for geolocation service
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&latitude=${lat}&longitude=${lng}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data for map click');
    const data = await response.json();
    displayResults(data);
    updateMap(lat, lng);
  } catch (error) {
    console.error('Error:', error);
    alert('Unable to fetch details for the clicked location.');
  }
});

// Event listener for button click
trackBtn.addEventListener('click', () => {
  const ip = ipInput.value.trim();
  fetchIPDetails(ip);
});

// Fetch current user's IP on load
window.onload = () => fetchIPDetails();

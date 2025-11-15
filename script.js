// Initialize map centered on India
const map = L.map("map").setView([20.5937, 78.9629], 5);

// Load OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let lineLayer = null;
let markers = [];

// Convert text place → coordinates
async function getCoordinates(place) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
  );
  const data = await res.json();
  if (data.length === 0) {
    alert(`❌ Location not found: ${place}`);
    return null;
  }
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

// Draw straight line between start and end
async function drawLine(startName, endName) {
  const startCoords = await getCoordinates(startName);
  const endCoords = await getCoordinates(endName);

  if (!startCoords || !endCoords) return;

  // Remove existing line & markers
  if (lineLayer) map.removeLayer(lineLayer);
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  // Add markers
  const startMarker = L.marker(startCoords).addTo(map).bindPopup("Start").openPopup();
  const endMarker = L.marker(endCoords).addTo(map).bindPopup("Destination");
  markers.push(startMarker, endMarker);

  // Draw straight line
  lineLayer = L.polyline([startCoords, endCoords], {
    color: "red",
    weight: 4,
    dashArray: "5,10",
  }).addTo(map);

  // Zoom map to fit line
  map.fitBounds(lineLayer.getBounds());
}

// Handle button click
document.getElementById("routeBtn").addEventListener("click", () => {
  const start = document.getElementById("start").value.trim();
  const end = document.getElementById("end").value.trim();

  if (!start || !end) {
    alert("Please enter both starting point and destination.");
    return;
  }

  drawLine(start, end);
});

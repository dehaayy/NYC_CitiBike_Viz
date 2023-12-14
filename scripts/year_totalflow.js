// Section for Leaflet Map Initialization
var totalFlowmap = L.map('totalFlowmap').setView([40.7128, -74.0177], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 190,
    attribution: '© OpenStreetMap contributors'
}).addTo(totalFlowmap);

// Initialize a Layer Group for the circles
var circleLayer = L.layerGroup().addTo(totalFlowmap);



function getColorForValue(value) {
  if (value < 2) return 'darkblue'; // Lowest color for values less than 2
  else if (value < 5) return 'blue';
  else if (value < 10) return 'green';
  else if (value < 15) return 'yellow';
  else return 'red';
}



// Function to update map based on selected year
function updateMapForYear(selectedYear) {
    // Clear existing circles
    circleLayer.clearLayers();

    // Load and process data
d3.csv('https://raw.githubusercontent.com/dehaayy/NYC_CitiBike_Viz/main/%E2%AD%90%EF%B8%8FProject%20Code/Cleaned%20Data%20p/Interactive_data/data_by_year_join.csv').then(function(data) {
        data.forEach(function(d) {
            d.variable = d.variable
            d.year = parseInt(d.year);
            d.total_flow = parseFloat(d.total_flow);
            d.lat = parseFloat(d.lat);
            d.lon = parseFloat(d.lon);

            if ((selectedYear === 'all' || d.year === parseInt(selectedYear)) && d.total_flow > 0)  {
                var color = getColorForValue(d.total_flow);

                var circle = L.circle([d.lat, d.lon], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: 60
                });

                // Add a popup with the total_flow value
                circle.bindPopup('<b>Station:</b> ' + d.variable + '<br><b>Total Flow:</b> ' + d.total_flow.toFixed(2));



                // Add the circle to the layer
                circleLayer.addLayer(circle);
            }
        });
    });
}
// Event listener for slider change
document.getElementById('yearSlider').addEventListener('input', function() {
    var selectedYear = this.value;
    document.getElementById('sliderValue').textContent = selectedYear; // Update the displayed year
    updateMapForYear(selectedYear);
});

// Initial map update
updateMapForYear(document.getElementById('yearSlider').value);






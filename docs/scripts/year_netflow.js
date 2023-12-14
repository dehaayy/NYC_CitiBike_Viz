// Section for Leaflet Map Initialization
var netFlowMap = L.map('netFlowMap').setView([40.7128, -74.0177], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(netFlowMap);

var netFlowCircleLayer = L.layerGroup().addTo(netFlowMap);


// Initialize a Layer Group for the circles

function getColorForValue2(value) {
  if (value >= -0.01 && value <= 0.01) return '#F7F7F7'; // Neutral color for values between -0.3 and 0.3
  else if (value < -0.01 && value >= -0.1) return '#E7D4E8'; // Color for values between -0.5 and -1.0
  else if (value < -0.1 && value >= -2.0) return '#C2A5CF'; // Color for values between -1.0 and -1.5
  else if (value < -0.2 && value >= -0.3) return '#9970AB'; // Color for values between -1.5 and -2.0
  else if (value < -0.3) return '#762A83'; // Color for values less than -2.0
  else if (value > 0.01 && value <= 0.1) return '#D9F0D3'; // Color for values between 0.3 and 0.5
  else if (value > 0.1 && value <= 0.2) return '#ACD39E'; // Color for values between 0.5 and 1.0
  else if (value > 0.2 && value <= 0.3) return '#5AAE61'; // Color for values between 1.0 and 1.5
  else if (value > 0.3) return '#1B7837'; // Color for values greater than 1.5
  else return 'black'; // Default color if none of the conditions are met
}




// Function to update map based on selected year
function updateMapForYear2(selectedYear) {
    // Clear existing circles
    netFlowCircleLayer.clearLayers();

    // Load and process data
d3.csv('https://raw.githubusercontent.com/dehaayy/NYC_CitiBike_Viz/main/%E2%AD%90%EF%B8%8FProject%20Code/Cleaned%20Data%20p/Interactive_data/data_by_year_join.csv').then(function(data) {
        data.forEach(function(d) {
            d.variable = d.variable
            d.year = parseInt(d.year);
            d.netflow = parseFloat(d.net_flow);
            d.lat = parseFloat(d.lat);
            d.lon = parseFloat(d.lon);

            if ((selectedYear === 'all' || d.year === parseInt(selectedYear)) && d.netflow != 0)  {
                var color = getColorForValue2(d.netflow);

                var circle = L.circle([d.lat, d.lon], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 1,
                    radius: 70
                });

                // Add a popup with the total_flow value
                circle.bindPopup('<b>Station:</b> ' + d.variable + '<br><b>Net Flow:</b> ' + d.netflow.toFixed(2));



                // Add the circle to the layer
                netFlowCircleLayer.addLayer(circle);
            }
        });
    });
}
// Event listener for slider change
document.getElementById('yearSlider').addEventListener('input', function() {
    var selectedYear = this.value;
    document.getElementById('sliderValue').textContent = selectedYear; // Update the displayed year
    updateMapForYear2(selectedYear);
});

// Initial map update
updateMapForYear2(document.getElementById('yearSlider').value);

// Section for Leaflet Map Initialization
var weekday_total = L.map('weekday_total').setView([40.7128, -74.0177], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(weekday_total);

var circleLayer_netweek = L.layerGroup().addTo(weekday_total);


// Initialize a Layer Group for the circles

function getColorForValue4(value) {
  if (value < 2) return 'darkblue'; // Lowest color for values less than 2
  else if (value < 5) return 'blue';
  else if (value < 10) return 'green';
  else if (value < 15) return 'yellow';
  else if (value < 20) return 'orange';
  else return 'red';
}

// Function to get weekday name from slider value
function getWeekdayName(value) {
    var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[value];
}

function updateMapForWeekday(selectedWeekday) {
    circleLayer_netweek.clearLayers(); // Clear existing circles

    d3.csv('https://raw.githubusercontent.com/dehaayy/NYC_CitiBike_Viz/main/%E2%AD%90%EF%B8%8FProject%20Code/Cleaned%20Data%20p/Interactive_data/data_by_weekdy_join.csv').then(function(data) {
        // Find the maximum total_flow value
        var maxTotalFlow = d3.max(data, function(d) { return parseFloat(d.total_flow); });

        // Define a color scale
        var colorScale = d3.scaleSequential(function(t) {
            return d3.interpolateRgb("#FFD9DA", "#D3111A")(t);
        }).domain([0, maxTotalFlow]);

        data.forEach(function(d) {
            d.total_flow = parseFloat(d.total_flow);
            d.lat = parseFloat(d.lat);
            d.lon = parseFloat(d.lon);

            if (d.weekday === getWeekdayName(parseInt(selectedWeekday)) && d.total_flow > 0) {
                var color = colorScale(d.total_flow); // Use the color scale

                var circle = L.circle([d.lat, d.lon], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: 70
                });

                // Add a popup with the total_flow value
                circle.bindPopup('<b>Station:</b> ' + d.variable + '<br><b>Total Flow:</b> ' + d.total_flow.toFixed(2));

                // Add the circle to the layer
                circleLayer_netweek.addLayer(circle);
            }
        });
    }); // Correctly placed closing braces for then function and csv call
}

// Event listener for weekday slider change
document.getElementById('weekdaySlider').addEventListener('input', function() {
    var selectedWeekday = this.value;
    document.getElementById('sliderWeekdayValue').textContent = getWeekdayName(selectedWeekday); // Update the displayed weekday
    updateMapForWeekday(selectedWeekday);
});

// Initial map update for the default weekday (Sunday)
updateMapForWeekday(document.getElementById('weekdaySlider').value);

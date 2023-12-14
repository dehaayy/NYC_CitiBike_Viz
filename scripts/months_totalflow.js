// Section for Leaflet Map Initialization
var months_total = L.map('months_total').setView([40.7128, -74.0177], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(months_total);

var circleLayer_months = L.layerGroup().addTo(months_total);


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
function getMonthName(value) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[value-1];
}

function updateMapForMonth(selectedMonth) {
    circleLayer_months.clearLayers();

    d3.csv('https://raw.githubusercontent.com/dehaayy/NYC_CitiBike_Viz/main/%E2%AD%90%EF%B8%8FProject%20Code/Cleaned%20Data%20p/Interactive_data/data_by_month_join.csv').then(function(data) {
        // Find the maximum total_flow value
        // Find the maximum total_flow value
        var maxTotalFlow = d3.max(data, function(d) { return parseFloat(d.total_flow); });

        console.log(maxTotalFlow)

        // Define a color scale
var colorScale = d3.scaleSequential(function(t) {
    return d3.interpolateRgb("#F5E4F8", "#6E62A8")(t);
}).domain([0, maxTotalFlow]);



        data.forEach(function(d) {
            d.total_flow = parseFloat(d.total_flow);
            d.lat = parseFloat(d.lat);
            d.lon = parseFloat(d.lon);
            d.month = parseInt(d.month); // Assuming there's a 'month' field in your data

            // Check if the data's month matches the selectedMonth
            // Note: Ensure the month in your data is 0-indexed (0 = January, 11 = December)
            if (d.month === parseInt(selectedMonth) && d.total_flow > 0) {
                var color = colorScale(d.total_flow); // Use the color scale

                var circle = L.circle([d.lat, d.lon], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.9,
                    radius: 70
                });

                // Add a popup with the total_flow value
                circle.bindPopup('<b>Station:</b> ' + d.variable + '<br><b>Total Flow:</b> ' + d.total_flow.toFixed(2));

                // Add the circle to the layer
                circleLayer_months.addLayer(circle);
            }
        });
    });
}

// Event listener for month slider change
document.getElementById('monthSlider').addEventListener('input', function() {
    var selectedMonth = this.value;
    document.getElementById('sliderMonthValue').textContent = getMonthName(selectedMonth); // Update the displayed month
    updateMapForMonth(selectedMonth);
});

// Initial map update for the default month (January)
updateMapForMonth(document.getElementById('monthSlider').value);


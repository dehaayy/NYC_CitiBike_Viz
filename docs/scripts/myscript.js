// Section for D3 Plot
// ... (Your existing D3 code for the plot)

// Section for Leaflet Map
var map = L.map('map').setView([37.8, -96], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);



// Read data from CSV file
d3.csv('data.csv').then(function(data) {
    data.forEach(function(d) {

        d.value = parseFloat(d.value);
        d.lat = parseFloat(d.lat);
        d.lon = parseFloat(d.lon);
        var color = getColorForValue(d.value);


        L.circle([+d.lat, +d.lon], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: 20000
        }).addTo(map);
    });
});

app.use(express.static('public'));

function getColorForValue(value) {
    if (value < 20) return 'blue';
    else if (value < 40) return 'green';
    else return 'red';
}

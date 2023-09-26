// Initialize the map
var myMap = L.map("map").setView([37.7749, -122.4194], 5);  // Centered on San Francisco

// Add an OpenStreetMap tile layer (background) to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © OpenStreetMap contributors",
    maxZoom: 19
}).addTo(myMap);

// Fetch earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    
    // Function to determine marker size based on magnitude
    function markerSize(magnitude) {
        return magnitude * 5; // Adjust this for your desired marker size
    }

    // Function to determine marker color based on depth
    function depthColor(depth) {
        if (depth > 90) return "red";
        else if (depth > 70) return "#FF4500"; // orangered
        else if (depth > 50) return "#FF8C00"; // darkorange
        else if (depth > 30) return "#FFD700"; // gold
        else if (depth > 10) return "#ADFF2F"; // greenyellow
        else return "green";
    }

    // Create a GeoJSON layer and add it to the map
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: depthColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo(myMap);

// Create a legend in the bottom right corner
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // Adding a title to our legend
    div.innerHTML += "<h4>Earthquake Depth</h4>";

    // Loop through our depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + depthColor(depths[i] + 1) + '; width: 20px; height: 20px; float: left; margin-right: 8px; opacity: 0.7;"></i>' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+') + '<br>';
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);
    
});



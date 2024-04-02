// Store API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform GET request URL.
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function to run once for each feature array.
  // Give features a popup that describes the time and place of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData.
  // Run the onEachFeature function once for each data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getCircleSize(feature.properties.mag),
        fillColor: getCircleColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: onEachFeature
  });

 // Push the earthquakes layer to the createMap function.
 createMap(earthquakes);
}

  // Circle Size
  function getCircleSize(magnitude) {
      let size;
      if (magnitude < 1) {
        size = 3;
      } else if (magnitude < 2.5) {
        size = 6;
      } else if (magnitude < 5) {
        size = 15;
      } else if (magnitude < 7) {
        size = 25;
      } else if (magnitude < 9) {
        size = 30;
      } else {
        size = 40;
      }
      return size
  }

  // Circle Color
  function getCircleColor(depth) {
    let color;
    console.log(depth)
    if (depth <= 10) {
      color = "#7ad71f";
    } else if (depth <= 30) {
      color = "#c5f209";
    } else if (depth <= 50) {
      color = "#ffc412";
    } else if (depth <= 70) {
      color = "#ffc000";
    } else if (depth <= 90) {
      color = "#fa8072";
    } else {
      color = "#f00c0c";
    }
    return color
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create overlay object.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, assigning the streetmap and earthquakes layers to display.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Send to baseMaps and overlayMaps.
  // Add layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    let labels = [];
    let depths = [10, 30, 50, 70, 90]

    //legend title
  let title = '<div class="legend-title">Earthquake Depth</div>';
  labels.push(title);

    depths.forEach(function(depth, index) {
      labels.push("<i style=\"background-color: " + getCircleColor(depths[index]) + "\"></i>"+depth+"<br>");
    });

    div.innerHTML += "" + labels.join("") + "";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}

//  <link href="/favicon.ico" type="image/x-icon" rel="icon" /> 
// Store our API endpoint as queryUrl.

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// var myMap = L.map("map", {
//   center: [27.96044, -82.30695],
//   zoom: 7
// });

//Function to determine circle size
function circleSize(mag) {
  return mag * 40000;
}
// Define a function to set the color of each marker based on the depth of the earthquake.
function getColor(depth) {
  var color="#FFEDA0";
  switch(true) {
      case (depth < 10):
          color="#FFEDA0";
          break;
      case (depth < 30):
          color="#FEB24C";
          break;
      case (depth < 50):
          color="#FD8D3C";
          break;
      case (depth < 70):
          color="#E31A1C";
          break;
      case (depth < 90):
          color="#BD0026";
          break;
      case (depth >= 90):
          color="#800026";
          break;
  }
  return color;
}

// Define a function to set the size of each marker based on the magnitude of the earthquake.
function getSize(magnitude) {
  return magnitude * 5;
}

// Perform a GET request to the USGS endpoint.
d3.json(url).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, time, magnitude, and depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      // Create a circle marker for each earthquake.
      return L.circleMarker(latlng, {
        radius: getSize(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }
  });

  // Send our earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
 
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  
    // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
/* 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
 */
  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
/*
var info = L.control({
  position: "bottomright"
});

var depthColors = {
  "l10": "#FFFFB2",
  "l30": "#FECC5C",
  "l50": "#FD8D3C",
  "l70": "#F03B20",
  "l90": "#BD0026",
  "g90": "#800026"
};

info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  var legendItems = "";

  for (var depth in depthColors) {
    legendItems += "<p class='" + depth + "' style='background-color: " + depthColors[depth] + "'>" + getLegendLabel(depth) + "</p>";
  }

  div.innerHTML = "<h2>Depth (km)</h2>" + legendItems;
  return div;
};

// Add the legend to the map.
info.addTo(myMap);

function getLegendLabel(depth) {
  switch (depth) {
    case "l10":
      return "Less than 10";
    case "l30":
      return "Between 10 and 30";
    case "l50":
      return "Between 30 and 50";
    case "l70":
      return "Between 50 and 70";
    case "l90":
      return "Between 70 and 90";
    case "g90":
      return "Greater than 90";
  }
}
*/
let legend = L.control({
  position: "bottomright"
});
// Then add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];
// Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // Finally, we our legend to the map.
  legend.addTo(map);

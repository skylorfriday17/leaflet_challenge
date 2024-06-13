let link = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-05-31&endtime=2024-06-06&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337'

function createFeatures(earthquakeData) {
      
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      let mag = feature.properties.mag;
      let coord = feature.geometry.coordinates;
      // console.log(mag);
      // console.log(coord);
      layer.bindPopup(`<h3>Earthquake Magnitude: ${feature.properties.mag}</h3><hr><p>Location: ${feature.properties.place}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`); 
    };
    
    function pointToLayer(feature, coord) {
      let mag = feature.properties.mag;
      let coordinate = feature.geometry.coordinates;

      let color = '';

      if (coordinate[2] > -5) {
        color = 'lightgreen';
      }
      if (coordinate[2] > 5) {
        color = 'yellow';
      }
      if (coordinate[2] > 10) {
        color = 'orange';
      }
      if (coordinate[2] > 15) {
        color = 'darkorange';
      }
      if (coordinate[2] > 20) {
        color = 'red';
      }
      
      let circleMarkerOptions = {
        radius: mag * 5,
        color: 'grey',
        fillColor: color,
        fillOpacity: 1
      }
      return L.circleMarker([coordinate[1], coordinate[0]], circleMarkerOptions)
    };
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  };


  function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
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
  
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
      let div = L.DomUtil.create('div', 'info legend')
    }
  };

d3.json(link).then(function(data) {
    createFeatures(data.features)
    console.log(data.features)
});
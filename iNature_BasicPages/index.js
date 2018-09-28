//Insperation: https://stackoverflow.com/questions/48170329/how-to-add-marker-by-method-openlayers-4-angular-4
//Kan få mer insperation från: https://openlayers.org/en/latest/examples/icon.html
//Kanske: https://openlayers.org/en/latest/examples/reusable-source.html
//Bra för framtiden: https://openlayers.org/en/latest/examples/snap.html
//https://openlayers.org/en/latest/examples/
import 'ol/ol.css';
import {fromLonLat, toLonLat,transform} from 'ol/proj';
import {Map, View} from 'ol';
import Draw from 'ol/interaction/Draw.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import * as style from 'ol/style';
import Feature from 'ol/Feature';
//import Point from 'ol/geom/Point';
//import {Icon, Style,Circle} from 'ol/style.js';
import {defaults as defaultControls, ZoomToExtent} from 'ol/control.js';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import {LineString, Point} from 'ol/geom.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';


//------------------- CREATES MAP AND LAYERS -------------------
//Creates a vector source
var markerSource = new VectorSource();

//Defiens marke style
var markerStyle = new Style({
  image: new ol.style.Circle({
    radius: 6,
    stroke: new ol.style.Stroke({
      color: 'white',
      width: 2
    }),
    fill: new ol.style.Fill({
        color:'rgba(32,178,170,0.65)'
    })
  })
});

//Creates a base map - open street map
var layer = new TileLayer({
  source: new OSM()
});

//Creates a vector layer
var vector = new VectorLayer({
  source: markerSource,
  style: markerStyle
});

//Definas a map
var map = new Map({
  // controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
  // interactions: ol.interaction.defaults({DoubleClickZoom :false}),
  //target : document.getElementById('map'),
  target : 'map',
  layers: [layer, vector],
  view: new View({
    center: fromLonLat([18.476403,57.530952]),
    zoom: 9
  }),
});

//------------------- LOADS ALL FEATURES FROM DATABASE WHEN REFRESHING PAGE -------------------
function loadAll(event) {
  console.log('from test'); //klienten
  $.ajax({
    url:'http://localhost:3000/coord',
    type: 'GET',
    success: function(res){
      // console.log(res);
      // var ajaxDisplay = document.getElementById(map);
      //                   ajaxDisplay.innerHTML = html
        for (var i in res) {
          console.log(res[i].lon);
          addMarker(res[i].lon, res[i].lat);
        }
    }
  });
}

//Loads all data form database
loadAll();

//------------------- CREATES FEATURES USING LON,LAT -------------------
//Creates a feature - a point
function addMarker(lon, lat) {
  console.log('lon:', lon);
  console.log('lat:', lat);
  //var iconFeatures = [];
  var iconFeature = new Feature({
  geometry: new Point(transform([lon, lat], 'EPSG:4326','EPSG:3857'))
  });
  markerSource.addFeature(iconFeature);
}

//------------------- CREATS FEATRUE, STORES IN DATABASE AND TAKES DESCRIPTION INPUT -------------------
//When double clicking: creates a point and popup with inputs
map.on('dblclick',function(event){
  var lonLat = toLonLat(event.coordinate);
  var descr = description();
  addMarker(lonLat[0], lonLat[1]); //Creates marker in map using lon & lat
  storeCoord(lonLat[0], lonLat[1], descr); //Stores corodinates in DB (table 'coord')
  console.log(descr);
});

//Function calls the POST function -- gets respons from client and stores
//coordinates in database
function storeCoord(lon, lat, descr) {
  console.log('from post');
  var request = $.ajax ({
   url: 'http://localhost:3000/coord',
   type: "POST",
   cache: false ,
   contentType: "application/json",
   data: JSON.stringify ({ //req body
     lon: lon,
     lat: lat,
     descr: descr
   })
   });
}

//Popup - asks for description
function description(event){
  var txt;
  var descr = prompt("Description:");
  if (descr == null || descr == ""){
    txt = "User cancelled the prompt";
  } else {
    txt = descr;
    return txt;
  }
}

//------------------- SHOWS THE NEAREST FEATURE FROM THE SINGLE CLICK POSITION -------------------
//Click and get the nearest feature
var point = null;
      var line = null;
      var displaySnap = function(coordinate) {
        var closestFeature = markerSource.getClosestFeatureToCoordinate(coordinate);
        if (closestFeature === null) {
          point = null;
          line = null;
        } else {
          var geometry = closestFeature.getGeometry();
          var closestPoint = geometry.getClosestPoint(coordinate);
          if (point === null) {
            point = new Point(closestPoint);
          } else {
            point.setCoordinates(closestPoint);
          }
          if (line === null) {
            line = new LineString([coordinate, closestPoint]);
          } else {
            line.setCoordinates([coordinate, closestPoint]);
          }
        }
        map.render();
      };

      map.on('singleclick', function(evt) {
        if (evt.clicking) {
          return;
        }
        var coordinate = map.getEventCoordinate(evt.originalEvent);
        displaySnap(coordinate);
      });

      map.on('singleclick', function(evt) {
        displaySnap(evt.coordinate);
      });

      var stroke = new Stroke({
        color: 'rgb(255,140,0)',
        width: 2
      });
      var style2 = new Style({
        stroke: stroke,
        image: new CircleStyle({
          radius: 10,
          stroke: stroke
        })
      });

      map.on('postcompose', function(evt) {
        var vectorContext = evt.vectorContext;
        vectorContext.setStyle(style2);
        if (point !== null) {
          vectorContext.drawGeometry(point);
        }
        if (line !== null) {
          vectorContext.drawGeometry(line);
        }
      });



// DET ÄR DET HÄR JAG JOBBAR MED BARA ENDAST OCH INGET OVANFÖR -----------------------------------------------------------------      
var positionArray = new VectorSource();

function addPositionMarker(lon, lat) {
  console.log('lon:', lon);
  console.log('lat:', lat);
  var iconFeature = new Feature({
  geometry: new Point(transform([lon, lat], 'EPSG:4326','EPSG:3857'))
  });
  positionArray.addFeature(iconFeature);
}

function geoFindMe() {
  var output = document.getElementById("out");
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  function success(position) {
    //positionArray.clear()
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    if (position.coords.accuracy < 200) {
      addPositionMarker(longitude, latitude); //Creates marker in map using lon & lat
      output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
      map.setView(new View({
        center: fromLonLat([longitude,latitude]),
        zoom: 15
      }))
    }
    else {
      output.innerHTML = "<p>Accuracy less than 200 m</p>";
    }
  }
  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }
  navigator.geolocation.getCurrentPosition(success, error);

}
function closeWatch() {
  var output = document.getElementById("out");
  positionArray.clear()
  output.innerHTML = "Tracking stopped!"
}

var b = document.getElementById("button");
b.addEventListener("click",geoFindMe);
var bc = document.getElementById("buttonClose");
bc.addEventListener("click",closeWatch);
// ------------------- STRUNT SOM ÄR BRA ATT HA I FALL ATT -------------------
//       map.on('singleclick', function(evt) {
//         if (evt.clicking) {
//           return;
//         }
//         var pixel = map.getEventPixel(evt.originalEvent);
//         var hit = map.hasFeatureAtPixel(pixel);
//         if (hit) {
//           map.getTarget().style2.cursor = 'pointer';
//         } else {
//           map.getTarget().style2.cursor = '';
//         }
//       });
//
// function post(x, y) {
//   console.log('from post');
//   var request = $.ajax ({
//    url: 'http://localhost:3000/test',
//    type: "POST",
//    cache: false ,
//    contentType: "application/json",
//    data: JSON.stringify ({ //req body
//      name: x,
//      password: y
//    })
//    });
// }
//
// Allt som har med knappar att göra
// var b = document.getElementById('btn');
// var b2 = document.getElementById('btn2');
// b.addEventListener('click', test);
// b2.addEventListener('click', loadAll);
//
// // ------ en annan del som fungerade bra, man la till punkter, se länk: https://openlayers.org/en/latest/examples/draw-features.html
// // var draw; // global so we can remove it later
// // function addInteraction() {
// //     draw = new Draw({
// //     source: source,
// //     type: "Point"
// //     });
// //     ondblclick = map.addInteraction(draw);
// //   }
// // //
// // // var draw; // global so we can remove it later
// // // function addInteraction() {
// // //   var value = typeSelect.value;
// // //   if (value !== 'None') {
// // //   draw = new Draw({
// // //     source: source,
// // //     type: typeSelect.value
// // //     });
// // //     map.addInteraction(draw);
// // //   }
// // // }
// //
// //
// // addInteraction();
//
// // ---------- det från labben som fungerade från början
//
// const map = new Map({
//   target: 'map',
//   layers: [
//     new TileLayer({
//       source: new OSM()
//     })
//   ],
//   view: new View({
//     center: fromLonLat([18.476403,57.530952]),
//     zoom: 9
//   })
// });


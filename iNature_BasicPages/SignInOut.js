
//Insperation: https://stackoverflow.com/questions/48170329/how-to-add-marker-by-method-openlayers-4-angular-4
//Kan få mer insperation från: https://openlayers.org/en/latest/examples/icon.html
//Kanske: https://openlayers.org/en/latest/examples/reusable-source.html
//Bra för framtiden: https://openlayers.org/en/latest/examples/snap.html
//https://openlayers.org/en/latest/examples/

//------------------- IMPORTS -------------------
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

//Creates a base map - open street map
var layer = new TileLayer({
  source: new OSM()
});

//Definas a map
var map = new Map({
  // controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
  // interactions: ol.interaction.defaults({DoubleClickZoom :false}),
  //target : document.getElementById('map'),
  target : 'map',
  layers: [layer],
  view: new View({
    center: fromLonLat([18.476403,57.530952]),
    zoom: 9
  }),
});


 //------------------- SIGN IN / SIGN OUT -------------------

 //SIGN IN
 function signin(form) {
   var uname = document.getElementById('username_in').value;
   var psw = document.getElementById('password_in').value;
   console.log(psw)
   console.log(uname)
   var request = $.ajax({
     url:'http://localhost:3000/signin',
     type: 'POST',
     cache: false ,
     contentType: "application/json",
     data: JSON.stringify ({ //req body
       uname: uname,
       psw: psw
     }),
     success: function(res){
       console.log(res.rows[0].case);
       var answ = res.rows[0].case;
       if (answ==true) {
         window.location.href = "./WEBGISProjectP3.html";
       }
       else {
         alert('The username or password is incorrect, please try again.')
       }
     }
   });
 }

 //SIGN UP
 function signup(form) {
   var uname = document.getElementById('username_up').value;
   var psw= document.getElementById('password_up').value;
   var confPsw = document.getElementById('confpassword_up').value;
   var randStr = require('randomstring');
   var yourString = randStr.generate(8);
   if (confPsw==psw && psw!="" && confPsw!="") {
     var request = $.ajax ({
       url: 'http://localhost:3000/signup',
       type: "POST",
       cache: false ,
       contentType: "application/json",
       data: JSON.stringify ({ //req body
         uname: uname,
         psw: psw,
         id: yourString
       }),
       success: function(res){
         console.log(res)
         if (res=='error') {
           alert("The username is already in use, please choose another one!")
         }
         else {
           alert("Welcome to iNature - please sign in!")
           $("#signUp .close").click()
         }
       }
     });
   }
   else {
     alert('Please, fill in all fields.')
   }
 }

 var a = document.getElementById("upBtn");
 a.addEventListener("click",signup);

 var b = document.getElementById("inBtn");
 b.addEventListener("click",signin);



























//
//
// //------------------- LOADS ALL FEATURES FROM DATABASE WHEN REFRESHING PAGE -------------------
// function loadAll(event) {
//   console.log('from test'); //klienten
//   $.ajax({
//     url:'http://localhost:3000/coord',
//     type: 'GET',
//     success: function(res){
//       // console.log(res);
//       // var ajaxDisplay = document.getElementById(map);
//       //                   ajaxDisplay.innerHTML = html
//         for (var i in res) {
//           console.log(res[i].lon);
//           addMarker(res[i].lon, res[i].lat);
//         }
//     }
//   });
// }
//
// //Loads all data form database
// loadAll();
//
// //------------------- CREATES FEATURES USING LON,LAT -------------------
// //Creates a feature - a point
// function addMarker(lon, lat) {
//   console.log('lon:', lon);
//   console.log('lat:', lat);
//   //var iconFeatures = [];
//   var iconFeature = new Feature({
//   geometry: new Point(transform([lon, lat], 'EPSG:4326','EPSG:3857'))
//   });
//   markerSource.addFeature(iconFeature);
// }
//
// //------------------- CREATS FEATRUE, STORES IN DATABASE AND TAKES DESCRIPTION INPUT -------------------
// //When double clicking: creates a point and popup with inputs
// map.on('dblclick',function(event){
//   var lonLat = toLonLat(event.coordinate);
//   var descr = description();
//   addMarker(lonLat[0], lonLat[1]); //Creates marker in map using lon & lat
//   storeCoord(lonLat[0], lonLat[1], descr); //Stores corodinates in DB (table 'coord')
//   console.log(descr);
// });
//
// //Function calls the POST function -- gets respons from client and stores
// //coordinates in database
// function storeCoord(lon, lat, descr) {
//   console.log('from post');
//   var request = $.ajax ({
//    url: 'http://localhost:3000/coord',
//    type: "POST",
//    cache: false ,
//    contentType: "application/json",
//    data: JSON.stringify ({ //req body
//      lon: lon,
//      lat: lat,
//      descr: descr
//    })
//    });
// }
//
// //Popup - asks for description
// function description(event){
//   var txt;
//   var descr = prompt("Description:");
//   if (descr == null || descr == ""){
//     txt = "User cancelled the prompt";
//   } else {
//     txt = descr;
//     return txt;
//   }
// }
//
// //------------------- SHOWS THE NEAREST FEATURE FROM THE SINGLE CLICK POSITION -------------------
// // Code from: https://openlayers.org/en/latest/examples/synthetic-points.html
// var point = null;
//       var line = null;
//       var displaySnap = function(coordinate) {
//         var closestFeature = markerSource.getClosestFeatureToCoordinate(coordinate);
//         if (closestFeature === null) {
//           point = null;
//           line = null;
//         } else {
//           var geometry = closestFeature.getGeometry();
//           var closestPoint = geometry.getClosestPoint(coordinate);
//           if (point === null) {
//             point = new Point(closestPoint);
//           } else {
//             point.setCoordinates(closestPoint);
//           }
//           if (line === null) {
//             line = new LineString([coordinate, closestPoint]);
//           } else {
//             line.setCoordinates([coordinate, closestPoint]);
//           }
//         }
//         map.render();
//       };
//
//       //Event handler
//       map.on('singleclick', function(evt) {
//         if (evt.clicking) {
//           return;
//         }
//         var coordinate = map.getEventCoordinate(evt.originalEvent);
//         displaySnap(coordinate);
//       });
//
//       // Displays snap
//       map.on('singleclick', function(evt) {
//         displaySnap(evt.coordinate);
//       });
//
//       // Line style
//       var stroke = new Stroke({
//         color: 'rgb(255,140,0)',
//         width: 2
//       });
//       var style2 = new Style({
//         stroke: stroke,
//         image: new CircleStyle({
//           radius: 10,
//           stroke: stroke
//         })
//       });
//
//       // Draws the geometry of the point and line on the map
//       map.on('postcompose', function(evt) {
//         var vectorContext = evt.vectorContext;
//         vectorContext.setStyle(style2);
//         if (point !== null) {
//           vectorContext.drawGeometry(point);
//         }
//         if (line !== null) {
//           vectorContext.drawGeometry(line);
//         }
//       });
//
//
//
//
//
//
//
//
//
//
//



















//------------------- STRUNT SOM ÄR BRA ATT HA I FALL ATT -------------------
      // map.on('singleclick', function(evt) {
      //   if (evt.clicking) {
      //     return;
      //   }
      //   var pixel = map.getEventPixel(evt.originalEvent);
      //   var hit = map.hasFeatureAtPixel(pixel);
      //   if (hit) {
      //     map.getTarget().style2.cursor = 'pointer';
      //   } else {
      //     map.getTarget().style2.cursor = '';
      //   }
      // });

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

//Allt som har med knappar att göra
// var b = document.getElementById('btn');
//var b2 = document.getElementById('btn2');
// b.addEventListener('click', test);
//b2.addEventListener('click', loadAll);

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
//
=======
//Insperation: https://stackoverflow.com/questions/48170329/how-to-add-marker-by-method-openlayers-4-angular-4
//Kan få mer insperation från: https://openlayers.org/en/latest/examples/icon.html
//Kanske: https://openlayers.org/en/latest/examples/reusable-source.html
//Bra för framtiden: https://openlayers.org/en/latest/examples/snap.html
//https://openlayers.org/en/latest/examples/

//------------------- IMPORTS -------------------
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

//Creates a base map - open street map
var layer = new TileLayer({
  source: new OSM()
});

//Definas a map
var map = new Map({
  // controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
  // interactions: ol.interaction.defaults({DoubleClickZoom :false}),
  //target : document.getElementById('map'),
  target : 'map',
  layers: [layer],
  view: new View({
    center: fromLonLat([18.476403,57.530952]),
    zoom: 9
  }),
});


 //------------------- SIGN IN / SIGN OUT -------------------

 //SIGN IN
 function signin(form) {
   var uname = document.getElementById('username_in').value;
   var psw = document.getElementById('password_in').value;
   console.log(psw)
   console.log(uname)
   var request = $.ajax({
     url:'http://localhost:3000/signin',
     type: 'POST',
     cache: false ,
     contentType: "application/json",
     data: JSON.stringify ({ //req body
       uname: uname,
       psw: psw
     }),
     success: function(res){
       console.log(res.rows[0].case);
       var answ = res.rows[0].case;
       if (answ==true) {
         window.location.href = "./WEBGISProjectP3.html";
       }
       else {
         alert('The username or password is incorrect, please try again.')
       }
     }
   });
 }

 //SIGN UP
 function signup(form) {
   var uname = document.getElementById('username_up').value;
   var psw= document.getElementById('password_up').value;
   var confPsw = document.getElementById('confpassword_up').value;
   var randStr = require('randomstring');
   var yourString = randStr.generate(8);
   if (confPsw==psw && psw!="" && confPsw!="") {
     var request = $.ajax ({
       url: 'http://localhost:3000/signup',
       type: "POST",
       cache: false ,
       contentType: "application/json",
       data: JSON.stringify ({ //req body
         uname: uname,
         psw: psw,
         id: yourString
       }),
       success: function(res){
         console.log(res)
         if (res=='error') {
           alert("The username is already in use, please choose another one!")
         }
         else {
           alert("Welcome to iNature - please sign in!")
           $("#signUp .close").click()
         }
       }
     });
   }
   else {
     alert('Please, fill in all fields.')
   }
 }

 var a = document.getElementById("upBtn");
 a.addEventListener("click",signup);

 var b = document.getElementById("inBtn");
 b.addEventListener("click",signin);



























//
//
// //------------------- LOADS ALL FEATURES FROM DATABASE WHEN REFRESHING PAGE -------------------
// function loadAll(event) {
//   console.log('from test'); //klienten
//   $.ajax({
//     url:'http://localhost:3000/coord',
//     type: 'GET',
//     success: function(res){
//       // console.log(res);
//       // var ajaxDisplay = document.getElementById(map);
//       //                   ajaxDisplay.innerHTML = html
//         for (var i in res) {
//           console.log(res[i].lon);
//           addMarker(res[i].lon, res[i].lat);
//         }
//     }
//   });
// }
//
// //Loads all data form database
// loadAll();
//
// //------------------- CREATES FEATURES USING LON,LAT -------------------
// //Creates a feature - a point
// function addMarker(lon, lat) {
//   console.log('lon:', lon);
//   console.log('lat:', lat);
//   //var iconFeatures = [];
//   var iconFeature = new Feature({
//   geometry: new Point(transform([lon, lat], 'EPSG:4326','EPSG:3857'))
//   });
//   markerSource.addFeature(iconFeature);
// }
//
// //------------------- CREATS FEATRUE, STORES IN DATABASE AND TAKES DESCRIPTION INPUT -------------------
// //When double clicking: creates a point and popup with inputs
// map.on('dblclick',function(event){
//   var lonLat = toLonLat(event.coordinate);
//   var descr = description();
//   addMarker(lonLat[0], lonLat[1]); //Creates marker in map using lon & lat
//   storeCoord(lonLat[0], lonLat[1], descr); //Stores corodinates in DB (table 'coord')
//   console.log(descr);
// });
//
// //Function calls the POST function -- gets respons from client and stores
// //coordinates in database
// function storeCoord(lon, lat, descr) {
//   console.log('from post');
//   var request = $.ajax ({
//    url: 'http://localhost:3000/coord',
//    type: "POST",
//    cache: false ,
//    contentType: "application/json",
//    data: JSON.stringify ({ //req body
//      lon: lon,
//      lat: lat,
//      descr: descr
//    })
//    });
// }
//
// //Popup - asks for description
// function description(event){
//   var txt;
//   var descr = prompt("Description:");
//   if (descr == null || descr == ""){
//     txt = "User cancelled the prompt";
//   } else {
//     txt = descr;
//     return txt;
//   }
// }
//
// //------------------- SHOWS THE NEAREST FEATURE FROM THE SINGLE CLICK POSITION -------------------
// // Code from: https://openlayers.org/en/latest/examples/synthetic-points.html
// var point = null;
//       var line = null;
//       var displaySnap = function(coordinate) {
//         var closestFeature = markerSource.getClosestFeatureToCoordinate(coordinate);
//         if (closestFeature === null) {
//           point = null;
//           line = null;
//         } else {
//           var geometry = closestFeature.getGeometry();
//           var closestPoint = geometry.getClosestPoint(coordinate);
//           if (point === null) {
//             point = new Point(closestPoint);
//           } else {
//             point.setCoordinates(closestPoint);
//           }
//           if (line === null) {
//             line = new LineString([coordinate, closestPoint]);
//           } else {
//             line.setCoordinates([coordinate, closestPoint]);
//           }
//         }
//         map.render();
//       };
//
//       //Event handler
//       map.on('singleclick', function(evt) {
//         if (evt.clicking) {
//           return;
//         }
//         var coordinate = map.getEventCoordinate(evt.originalEvent);
//         displaySnap(coordinate);
//       });
//
//       // Displays snap
//       map.on('singleclick', function(evt) {
//         displaySnap(evt.coordinate);
//       });
//
//       // Line style
//       var stroke = new Stroke({
//         color: 'rgb(255,140,0)',
//         width: 2
//       });
//       var style2 = new Style({
//         stroke: stroke,
//         image: new CircleStyle({
//           radius: 10,
//           stroke: stroke
//         })
//       });
//
//       // Draws the geometry of the point and line on the map
//       map.on('postcompose', function(evt) {
//         var vectorContext = evt.vectorContext;
//         vectorContext.setStyle(style2);
//         if (point !== null) {
//           vectorContext.drawGeometry(point);
//         }
//         if (line !== null) {
//           vectorContext.drawGeometry(line);
//         }
//       });
//
//
//
//
//
//
//
//
//
//
//



















//------------------- STRUNT SOM ÄR BRA ATT HA I FALL ATT -------------------
      // map.on('singleclick', function(evt) {
      //   if (evt.clicking) {
      //     return;
      //   }
      //   var pixel = map.getEventPixel(evt.originalEvent);
      //   var hit = map.hasFeatureAtPixel(pixel);
      //   if (hit) {
      //     map.getTarget().style2.cursor = 'pointer';
      //   } else {
      //     map.getTarget().style2.cursor = '';
      //   }
      // });

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

//Allt som har med knappar att göra
// var b = document.getElementById('btn');
//var b2 = document.getElementById('btn2');
// b.addEventListener('click', test);
//b2.addEventListener('click', loadAll);

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
//
>>>>>>> 224561924c6c30d2f314ff6bef89a4619b9d2823

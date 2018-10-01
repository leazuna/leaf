// Several imports enabling the function of the map, BingMap is specific for the satellite map
import 'ol/ol.css';
import {fromLonLat, toLonLat,transform} from 'ol/proj';
import {Overlay, Map, View} from 'ol';
import Draw from 'ol/interaction/Draw.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {BingMaps, OSM, Vector as VectorSource} from 'ol/source.js';
import * as style from 'ol/style';
import Feature from 'ol/Feature';
import {defaults as defaultControls, ZoomToExtent} from 'ol/control.js';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import {LineString, Point} from 'ol/geom.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
//-------------------------------------------------------------------------------------------------------------------------------------------
//
//-------------------------------------------------------------------- POINT & LAYER STYLES FOR VECTOR LAYERS
//Defines marker style for the "my-position-marker" - fungerar inte med nuvarande version av importen. skiljer för alla olika ikoner. behöver kollas upp.
var posStyle = new Style({
  text: new ol.style.Text({
    text: '\uf3c5',
    font: 'normal 20px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
        color: 'black',
    }),
    stroke: new ol.style.Stroke({
        color: 'black',
        width: 1
    })
  })
});
//Defiens marke style for My places/Create
var myPlaceStyle = new Style({
  image: new ol.style.Circle({
    radius: 10,
    stroke: new ol.style.Stroke({
      color: 'white',
      width: 2
    }),
    fill: new ol.style.Fill({
        color:'rgba(74,99,0,0.5)'
    })
  })
});
//-------------------------------------------------------------------------------------------------------------------------------------------
//
//-------------------------------------------------------------------- MAP & VECTOR LAYERS
//Creates a base map - open street map
var roads = new TileLayer({
  source: new OSM()
});
//Creates a satellite map - open street layer
var satellite = new TileLayer({
    source: new BingMaps({key: 'Av5H9QA0C4Tkx7t4ixpe2y39YvWcmCMzLBu3mJT-hU44U5z12GqTGd7KO-WF_S3V', imagerySet: 'Aerial'})
  });
// Creating an array to store the position in, so that it can be removed later on
var positionArray = new VectorSource();
//Creates a vector layer for the location point
var myPos = new VectorLayer({
  source: positionArray,
  style: posStyle
});

//Creates an vector array to store positions of 'My places'
var myPlaceArray = new VectorSource();

//Creates an vector layer containing vector array and styling for markers of 'My places'
var myPlace = new VectorLayer({
  source: myPlaceArray,
  style: myPlaceStyle
});
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- DEFINING THE MAP AND IT´S VIEW AND LAYERS
//Defines the map - NOTE satellite should NOT be included in the map as it is added later in functions
var map = new Map({
    target : 'map',
    layers: [roads, myPos, myPlace],
    view: new View({
      center: fromLonLat([18.160513,59.289951]),
      zoom: 15,
    }),
  });
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- FIND MY LOCATION FUNCTIONS
//Adds the marker for my position and adds it to the vector array
function addPositionMarker(lon, lat) {
  console.log('lon:', lon);
  console.log('lat:', lat);
  var iconFeature = new Feature({
  geometry: new Point(transform([lon, lat], 'EPSG:4326','EPSG:3857'))
  });
  positionArray.addFeature(iconFeature);
}
//Removes previous marker, collects long, lat and runs the addPositionMarker function as well as zooms to the position, at 2 zoom levels higher than what was started at
function geoFindMe() {
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  function success(position) {
    positionArray.clear()
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    if (position.coords.accuracy < 200) {
      addPositionMarker(longitude, latitude); //Creates marker in map using lon & lat
      map.setView(new View({
        center: fromLonLat([longitude,latitude]),
        zoom: 17
      }))
    }
    else {}
  }
  function error() {}
  navigator.geolocation.getCurrentPosition(success, error);
}
//Function for removing the marker when pressing "hide my location"
function hideLocation() {
  positionArray.clear()
}
//Eventlistner listnening to the show/hide position, starting the functions
var sp = document.getElementById("showPos");
if (sp) {
  sp.addEventListener("click",geoFindMe,false);
}
var hp = document.getElementById("hidePos");
if(hp) {
  hp.addEventListener("click",hideLocation,false);
}
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- CHANGE BACKGROUND MAP FUNCTIONS
//Changes the map to satellite imagery
var Satellite = document.getElementById("ChangeSatellite");
if(Satellite){
  Satellite.addEventListener("click", SatImg, false);
  function SatImg(){
    map.getLayers().removeAt(0);
    map.getLayers().insertAt(0, satellite);
  }
}
//Changes the map to regular road map
var RegMap = document.getElementById("ChangeRoads");
if(RegMap) {
  RegMap.addEventListener("click", RoadMap,false);
  function RoadMap(){
    map.getLayers().removeAt(0);
    map.getLayers().insertAt(0, roads);
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- LOAD ALL FEATURES FROM THE DATABASE WHEN CLICKING ON button my 'My places'
//Loads all "My places" for a specific user (user not handled yet)
function loadMyPlaces(event) {
  $.ajax({
    url:'http://localhost:3000/myplaces',
    type: 'GET',
    success: function(res){
      for (var i in res) {
        //console.log(res[i].lon);
        addMyPlaceMarker(res[i].lon, res[i].lat,res[i].place,res[i].descr);
      }
    }
  });
}
//Controls the 'My place' (heart) button: if true (features not loaded), loads features - if false (features loaded), removes features
var noFeatures = true;
function showHideMyPlaces() {
  if(noFeatures) {
    loadMyPlaces();
  }
  else myPlaceArray.clear()
  noFeatures  = !noFeatures;
}
//Triggers showHideMyPlaces function
var triggMyPlaces = document.getElementById("myplaces");
triggMyPlaces.addEventListener("click",showHideMyPlaces);
//Changes heart-symbol depending on what state it has; if loaded features, then green, if not loaded features, then white
$("#myplaces").click(function(event) {
  $(this).find('i').toggleClass('fa fa-heart').toggleClass('far fa-heart');
});
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- FUNCTIONS FOR POPPUPS of 'My places'
//Defines a new pop up
var element = document.getElementById('popup');
var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});
//Adds popup to the map
map.addOverlay(popup);
//When clicking on a feature in the map, a popup with belonging information
map.on('click', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature, layer) {
      return feature;
    });
  if (feature) {
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();
    popup.setPosition(coord);
    $(element).popover({
      'placement': 'top',
      'html': true,
      'title': feature.get('place'),
      'content': feature.get('descr')
    });
    $(element).popover('show');
  } else {
    $(element).popover('destroy');
  }
});
//Not used but may be used in the future - SAVE
// // change mouse cursor when over marker
// map.on('pointermove', function(e) {
//   if (e.dragging) {
//     $(element).popover('destroy');
//     return;
//   }
//   var pixel = map.getEventPixel(e.originalEvent);
//   var hit = map.hasFeatureAtPixel(pixel);
//   //map.getTarget().style.cursor = hit ? 'pointer' : '';
// });
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- FUNCTIONS FOR CREATE (My places)
//Creates a feature when creating adding a new place to 'My places'
function addMyPlaceMarker(lon, lat, place, descr) {
  var iconFeature = new Feature({
  geometry: new Point(transform([lon, lat], 'EPSG:4326','EPSG:3857')),
  place: place,
  descr: descr
  });
  myPlaceArray.addFeature(iconFeature);
}
//When single clicking: opens modal/popup form for Create-inputs (My position)
var coord = []; //When clicking on the map, coordinates gets stored in the array
map.on('click',function(event){
  var GetCreate = document.getElementById("CreateBut");
  var create = GetCreate.getAttribute("aria-expanded");
  var lonLat = toLonLat(event.coordinate);
  coord.push(lonLat[0]);
  coord.push(lonLat[1]);
  if (create == 'true'){
    // $(document).ready(function() {
      $("#description").modal();
      //Not used but may be used in the future - SAVE
      // $('#description').on('click', '.btn-primary', function(){
      //   place = $('#place').val();
      //   var descr = $('#descr').val();
      //   //$(".modal-body input").val("")
      //   //console.log(place);
      //   //console.log(descr);
      // $("#description.close").click()
      // });
  }
  else {}
});
//Triggers function createMyPosition when clicking on button SAVE in modal/popup
var save = document.getElementById("save");
if(save) {
  save.addEventListener("click",createMyPosition, false);
}
//Inserts longitude, latitude, name and description of 'My place' in database and creates a marker in the map
function createMyPosition() {
  var lon = coord[0];
  var lat = coord[1];
  var place = document.getElementById('place').value;
  var descr = document.getElementById('descr').value;
  addMyPlaceMarker(lon, lat, place, descr);
  if (place != "") {
    var request = $.ajax ({
      url: 'http://localhost:3000/create',
      type: "POST",
      cache: true ,
      contentType: "application/json",
      data: JSON.stringify ({ //req body
        lon: lon,
        lat: lat,
        place: place,
        descr: descr
      })
    });
    $('.form-control').val("")
    $("#description .close").click()
    coord = [];
  }
  else {
    alert("Please, give your place a name!");
  }
}

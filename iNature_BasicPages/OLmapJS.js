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

//Creating vector layer to store position of 'My places'
var markerSource = new VectorSource();

//Creates vector layer containing markers for 'My places'
var create = new VectorLayer({
  source: markerSource,
  style: markerStyle
});
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- DEFINING THE MAP AND IT´S VIEW AND LAYERS
//Defines the map - NOTE satellite should NOT be included in the map as it is added later in functions
var map = new Map({
    target : 'map',
    layers: [roads, myPos, create],
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
sp.addEventListener("click",geoFindMe);
var hp = document.getElementById("hidePos");
hp.addEventListener("click",hideLocation);
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- CHANGE BACKGROUND MAP FUNCTIONS
//Changes the map to satellite imagery
var Satellite = document.getElementById("ChangeSatellite");
Satellite.addEventListener("click", SatImg);
  function SatImg(){
    map.getLayers().removeAt(0);
    map.getLayers().insertAt(0, satellite);
  }
//Changes the map to regular road map
var RegMap = document.getElementById("ChangeRoads");
RegMap.addEventListener("click", RoadMap);
  function RoadMap(){
    map.getLayers().removeAt(0);
    map.getLayers().insertAt(0, roads);
  }
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- FUNCTIONS FOR CREATE (creat My position)
//Creates a feature - a point
function addMarker(lon, lat) {
  var iconFeature = new Feature({
  geometry: new Point(transform([lon, lat], 'EPSG:4326','EPSG:3857'))
  });
  markerSource.addFeature(iconFeature);
}
//When single clicking: opens modal/popup form for Create-inputs (My position)
var coord = []; //When clicking on the map, the coordinates gets stored in the array
map.on('click',function(event){
  var GetCreate = document.getElementById("CreateBut");
  var create = GetCreate.getAttribute("aria-expanded");
  var lonLat = toLonLat(event.coordinate);
  coord.push(lonLat[0]);
  coord.push(lonLat[1]);
  if (create == 'true'){
    // $(document).ready(function() {
      $("#description").modal();
      // Något som fungerade men men upprade funktioner - får sparas så länge
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
//When clicking on SAVE in modal/popup - calls the function storeDescr
var save = document.getElementById("save");
save.addEventListener("click",storeMyPosition);
//Function; inserts longitude, latitude, name of 'My place' and 'Description' in database and
//creates a marker on the map
function storeMyPosition() {
  var lon = coord[0];
  var lat = coord[1];
  var place = document.getElementById('place').value;
  var descr = document.getElementById('descr').value;
  addMarker(lon, lat);
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

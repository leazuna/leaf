// Several imports enabling the function of the map, BingMap is specific for the satellite map
import 'ol/ol.css';
import { fromLonLat, toLonLat, transform } from 'ol/proj';
import { Overlay, Map, View } from 'ol';
import Draw from 'ol/interaction/Draw.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { BingMaps, OSM, Vector as VectorSource } from 'ol/source.js';
import * as style from 'ol/style';
import Feature from 'ol/Feature';
import { defaults as defaultControls, ZoomToExtent } from 'ol/control.js';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import { LineString, Point } from 'ol/geom.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
//-------------------------------------------------------------------------------------------------------------------------------------------
//
//-------------------------------------------------------------------- POINT & LAYER STYLES FOR VECTOR LAYERS
//Defines marker style for the "my-position-marker"
var posStyle = new Style({
  text: new ol.style.Text({
    text: '\uf041',
    font: 'normal 20px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 1
    })
  })
});
//Defines marker style for the "bathing sites"
var bathingSiteStyle = new Style({
  text: new ol.style.Text({
    text: '\uf1cd',
    font: 'normal 17px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 10
    })
  })
});
//Defines marker style for the "natural bathing sites"
var naturalBathingSiteStyle = new Style({
  text: new ol.style.Text({
    text: '\uf043',
    font: 'normal 17px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 1
    })
  })
});
//Defines marker style for the "viewpoints"
var viewPointsStyle = new Style({
  text: new ol.style.Text({
    text: '\uf1e5',
    font: 'normal 17px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 1
    })
  })
});
//Defines marker style for the "Hidden Gems"
var gemsStyle = new Style({
  text: new ol.style.Text({
    text: '\uf219',
    font: 'normal 17px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 1
    })
  })
});
//Defines marker style for the "clicked point"
var clickedStyle = new Style({
  text: new ol.style.Text({
    text: '\uf276',
    font: 'normal 17px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 1
    })
  })
});
//Defines marker style for the "search result"
var searchResultStyle = new Style({
  text: new ol.style.Text({
    text: '\uf006',
    font: 'normal 17px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 1
    })
  })
});
//Defiens marke style for My places/Create for the signed in user
var myPlaceStyle = new Style({
  text: new ol.style.Text({
    text: '\uf004',
    font: 'normal 17px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 1
    })
  })
});
//Defiens marke style for My places/Create for all users
var otherUsersPlaceStyle = new Style({
  text: new ol.style.Text({
    text: '\uf192',
    font: 'normal 17px FontAwesome',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: '#4a6300',
    }),
    stroke: new ol.style.Stroke({
      color: '#4a6300',
      width: 1
    })
  })
});
var searchTrailStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'red',
    width: 1
  })
});
var roadStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'black',
    width: 3
  })
});
var largeTrailStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'black',
    width: 2,
    lineDash: [4, 4]
  })
});
var trailStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'black',
    width: 1,
    lineDash: [4, 4]
  })
});
var smallTrailStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'grey',
    width: 1,
    lineDash: [4, 4]
  })
});
var greenTrailStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'green',
    width: 2
  })
});
var redTrailStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'red',
    width: 2
  })
});
var blueTrailStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'blue',
    width: 2
  })
});
var purpleTrailStyle = new Style({
  stroke: new ol.style.Stroke({
    color: 'purple',
    width: 2
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
  source: new BingMaps({ key: 'Av5H9QA0C4Tkx7t4ixpe2y39YvWcmCMzLBu3mJT-hU44U5z12GqTGd7KO-WF_S3V', imagerySet: 'Aerial' })
});

// Creating an array to store the position in, so that it can be removed later on
var positionArray = new VectorSource();
//Creates a vector layer for the location point
var myPos = new VectorLayer({
  source: positionArray,
  style: posStyle
});
// Creating an array to store the bathing site position in, so that it can be removed later on
var bathingSiteArray = new VectorSource();
//Creates a vector layer for the location point
var bathingSitePos = new VectorLayer({
  source: bathingSiteArray,
  style: bathingSiteStyle
});
// Creating an array to store the natural bathing site position in, so that it can be removed later on
var naturalBathingSiteArray = new VectorSource();
//Creates a vector layer for the location point
var naturalBathingSitePos = new VectorLayer({
  source: naturalBathingSiteArray,
  style: naturalBathingSiteStyle
});
// Creating an array to store the viewpoints position in, so that it can be removed later on
var viewPointsArray = new VectorSource();
//Creates a vector layer for the location point
var viewPointsPos = new VectorLayer({
  source: viewPointsArray,
  style: viewPointsStyle
});
// Creating an array to store the gems position in, so that it can be removed later on
var gemsArray = new VectorSource();
//Creates a vector layer for the location point
var gemsPos = new VectorLayer({
  source: gemsArray,
  style: gemsStyle
});
// Creating an array to store the clicked position in, so that it can be removed later on
var clickedArray = new VectorSource();
//Creates a vector layer for the location point
var clickedPos = new VectorLayer({
  source: clickedArray,
  style: clickedStyle
});
// Creating an array to store the search results position in, so that it can be removed later on
var searchResultArray = new VectorSource();
//Creates a vector layer for the location point
var searchResultPos = new VectorLayer({
  source: searchResultArray,
  style: searchResultStyle
});
// Creating an array to store the search trail results position in, so that it can be removed later on
var searchTrailArray = new VectorSource();
//Creates a vector layer for the trail
var searchTrail = new VectorLayer({
  source: searchTrailArray,
  style: searchTrailStyle
});

//Creates an vector array to store positions of 'My places' for the signed in user
var myPlaceArray = new VectorSource();
//Creates an vector layer containing vector array and styling for markers of 'My places'
var myPlace = new VectorLayer({
  source: myPlaceArray,
  style: myPlaceStyle
});
//Creates an vector array to store positions of 'My places' for all users
var myPlaceArrayAll = new VectorSource();
//Creates an vector layer containing vector array and styling for markers of 'My places'
var myPlaceAll = new VectorLayer({
  source: myPlaceArrayAll,
  style: otherUsersPlaceStyle
});
//Creates an vector array to store positions of 'My places'
var otherUsersPlaceArray = new VectorSource();
//Creates an vector layer containing vector array and styling for markers of 'My places'
var otherUsersPlace = new VectorLayer({
  source: otherUsersPlaceArray,
  style: otherUsersPlaceStyle
});
//Creates an vector array to store line objects in, so that it can be removed later on
var largeTrailArray = new VectorSource({});
//Creates a vector layer for the create line
var largeTrail = new VectorLayer({
  source: largeTrailArray,
  style: largeTrailStyle
});
//Creates an vector array to store line objects in, so that it can be removed later on
var roadsArray = new VectorSource({});
//Creates a vector layer for the create line
var roadsLayer = new VectorLayer({
  source: roadsArray,
  style: roadStyle
});
// //Creates an vector array to store line objects in, so that it can be removed later on
var trailArray = new VectorSource({});
//Creates a vector layer for the create line
var trail = new VectorLayer({
  source: trailArray,
  style: trailStyle
});
//Creates an vector array to store line objects in, so that it can be removed later on
var smallTrailArray = new VectorSource({});
//Creates a vector layer for the create line
var smallTrail = new VectorLayer({
  source: smallTrailArray,
  style: smallTrailStyle
});
// //Creates an vector array to store line objects in, so that it can be removed later on
var greenTrailArray = new VectorSource({});
//Creates a vector layer for the create line
var greenTrail = new VectorLayer({
  source: greenTrailArray,
  style: greenTrailStyle
});
// //Creates an vector array to store line objects in, so that it can be removed later on
var redTrailArray = new VectorSource({});
//Creates a vector layer for the create line
var redTrail = new VectorLayer({
  source: redTrailArray,
  style: redTrailStyle
});
//Creates an vector array to store line objects in, so that it can be removed later on
var blueTrailArray = new VectorSource({});
//Creates a vector layer for the create line
var blueTrail = new VectorLayer({
  source: blueTrailArray,
  style: blueTrailStyle
});
// //Creates an vector array to store line objects in, so that it can be removed later on
var purpleTrailArray = new VectorSource({});
//Creates a vector layer for the create line
var purpleTrail = new VectorLayer({
  source: purpleTrailArray,
  style: purpleTrailStyle
});
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- DEFINING THE MAP AND IT´S VIEW AND LAYERS
//Defines the map - NOTE satellite should NOT be included in the map as it is added later in functions
var map = new Map({
  target: 'map',
  layers: [roads, greenTrail, redTrail, blueTrail, purpleTrail, roadsLayer, trail, smallTrail, largeTrail, searchTrail, myPos, myPlace, myPlaceAll, bathingSitePos, naturalBathingSitePos, viewPointsPos, gemsPos, clickedPos, searchResultPos, otherUsersPlace],
  view: new View({
    center: fromLonLat([18.160513, 59.289951]),
    zoom: 15,
  }),
});
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- FIND MY LOCATION FUNCTIONS
//Adds the marker for my position and adds it to the vector array
function addPositionMarker(lon, lat, targetArray) {
  console.log('lon:', lon);
  console.log('lat:', lat);
  var iconFeature = new Feature({
    geometry: new Point(transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
  });
  if (targetArray === "myPos") {
    positionArray.addFeature(iconFeature);
  }
  else if (targetArray === "clickedArray") {
    clickedArray.addFeature(iconFeature);
  }
  else if (targetArray === "searchResult") {
    searchResultArray.addFeature(iconFeature);
  }
}
//Removes previous marker, collects long, lat and runs the addPositionMarker function as well as zooms to the position, at 2 zoom levels higher than what was started at
function geoFindMe() {
  if (!navigator.geolocation) {
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  function success(position) {
    positionArray.clear()
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    addPositionMarker(longitude, latitude, "myPos"); //Creates marker in map using lon & lat
    map.setView(new View({
      center: fromLonLat([longitude, latitude]),
      zoom: 17
    }))
  }
  function error() { }
  navigator.geolocation.getCurrentPosition(success, error);
}
//Function for removing the marker when pressing "hide my location"
function hideLocation() {
  positionArray.clear()
}
//Eventlistner listnening to the show/hide position, starting the functions
var sp = document.getElementById("showPos");
if (sp) {
  sp.addEventListener("click", geoFindMe, false);
}
var hp = document.getElementById("hidePos");
if (hp) {
  hp.addEventListener("click", hideLocation, false);
}
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- CHANGE BACKGROUND MAP FUNCTIONS
//Changes the map to satellite imagery
var Satellite = document.getElementById("ChangeSatellite");
if (Satellite) {
  Satellite.addEventListener("click", SatImg, false);
  function SatImg() {
    map.getLayers().removeAt(0);
    map.getLayers().insertAt(0, satellite);
  }
}
//Changes the map to regular road map
var RegMap = document.getElementById("ChangeRoads");
if (RegMap) {
  RegMap.addEventListener("click", RoadMap, false);
  function RoadMap() {
    map.getLayers().removeAt(0);
    map.getLayers().insertAt(0, roads);
  }
}
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- LOAD ALL FEATURES FROM myPlaces THE DATABASE WHEN CLICKING ON BUTTON 'My places'
//Loads all "My places" for a specific user (user not handled yet)
function loadMyPlaces(event) {
  $.ajax({
    url: 'http://localhost:3000/myplaces',
    type: 'GET',
    success: function (res) {
      for (var i in res) {
        //console.log(res[i].lon);
        addMyPlaceMarker(res[i].lon, res[i].lat, res[i].place, res[i].descr);
      }
    }
  });
}
//Controls the 'My place' (heart) button: if true (features not loaded), loads features - if false (features loaded), removes features
var noFeatures = true;
function showHideMyPlaces() {
  if (noFeatures) {
    loadMyPlaces();
  }
  else myPlaceArray.clear()
  noFeatures = !noFeatures;
}
//Triggers showHideMyPlaces function
var triggMyPlaces = document.getElementById("myplaces");
triggMyPlaces.addEventListener("click", showHideMyPlaces);
//Changes heart-symbol depending on what state it has; if loaded features, then green, if not loaded features, then white
$("#myplaces").click(function (event) {
  $(this).find('i').toggleClass('fa fa-heart').toggleClass('far fa-heart');
});
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- LOAD ALL FEATURES FROM myPlaces THE DATABASE WHEN CLICKING ON BUTTON 'My places'
//Creates a feature when creating adding a new place to 'My places'
function addMyPlaceMarkerAll(lon, lat, place, descr) {
  var iconFeature = new Feature({
    geometry: new Point(transform([lon, lat], 'EPSG:4326', 'EPSG:3857')),
    place: place,
    descr: descr
  });
  myPlaceArrayAll.addFeature(iconFeature);
}
//Loads all "My places" for a specific user (user not handled yet)
function loadMyPlacesAll(event) {
  $.ajax({
    url: 'http://localhost:3000/myplacesall',
    type: 'GET',
    success: function (res) {
      for (var i in res) {
        //console.log(res[i].lon);
        addMyPlaceMarkerAll(res[i].lon, res[i].lat, res[i].place, res[i].descr);
      }
    }
  });
}
//Controls the 'My place' (heart) button: if true (features not loaded), loads features - if false (features loaded), removes features
var noFeaturesAll = true;
function showHideMyPlacesAll() {
  if (noFeaturesAll) {
    loadMyPlacesAll();
  }
  else myPlaceArrayAll.clear()
  noFeaturesAll = !noFeaturesAll;
}
//Triggers showHideMyPlaces function
var triggMyPlacesAll = document.getElementById("otherUsersplaces");
triggMyPlacesAll.addEventListener("click", showHideMyPlacesAll);
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- FUNCTIONS FOR POPPUPS OF 'My places'
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
map.on('click', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function (feature, layer) {
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
    geometry: new Point(transform([lon, lat], 'EPSG:4326', 'EPSG:3857')),
    place: place,
    descr: descr
  });
  myPlaceArray.addFeature(iconFeature);
}
//When single clicking: opens modal/popup form for Create-inputs (My position)
var coord = []; //When clicking on the map, coordinates gets stored in the array
map.on('click', function (event) {
  var GetCreate = document.getElementById("CreateBut");
  var create = GetCreate.getAttribute("aria-expanded");
  var lonLat = toLonLat(event.coordinate);
  coord.push(lonLat[0]);
  coord.push(lonLat[1]);
  if (create == 'true') {
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
  else { }
});
//Triggers function createMyPosition when clicking on button SAVE in modal/popup
var save = document.getElementById("save");
if (save) {
  save.addEventListener("click", createMyPosition, false);
}
//Inserts longitude, latitude, name and description of 'My place' in database and creates a marker in the map
function createMyPosition() {
  var lon = coord[0];
  var lat = coord[1];
  var place = document.getElementById('place').value;
  var descr = document.getElementById('descr').value;
  addMyPlaceMarker(lon, lat, place, descr);
  if (place != "") {
    var request = $.ajax({
      url: 'http://localhost:3000/create',
      type: "POST",
      cache: true,
      contentType: "application/json",
      data: JSON.stringify({ //req body
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
//-------------------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------- FUNCTIONS FOR FIND
//Declaring global variables and default values
//var findFromPos = false;
//var findFromPoint = true;
//var findFromTrail = false;
var latitude;
var longitude;
var clickcoordinate = [18.160513, 59.289951];
var urlend = "/w_bathmade";
var target = "point";
var table;

var searchclickpoint = document.getElementById("StartSearch");
searchclickpoint.addEventListener("click", function () { findpoints() });


map.on('singleclick', function (evt) {
  clickcoordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'); //map.getEventCoordinate(evt.originalEvent)
});

function findpoints() {

  if ($("input[name='SearchInit']:checked").val() == "fromGPSlocation") {
    var findFromPos = true;
    var findFromPoint = false;
    var findFromTrail = false;
  }
  else if ($("input[name='SearchInit']:checked").val() == "fromClick") {
    var findFromPos = false;
    var findFromPoint = true;
    var findFromTrail = false;
  }
  /* Inte implementerat ännu
  else if ($("input[name='SearchInit']:checked").val() == "fromTrail") {
    findFromPos = false;
    findFromPoint = false;
    findFromTrail = true;
}*/
  if ($("input[name='SearchChoice']:checked").val() == "bathSite") {
    urlend = "/w_bathmade";
    target = "point";
    table = "w_bathmade";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "NaturBathSite") {
    urlend = "/w_bathnatural";
    target = "point";
    table = "w_bathnatural";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "View") {
    urlend = "/w_viewpoint";
    target = "point";
    table = "w_viewpoint";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "Gems") {
    urlend = "/w_nicespots";
    target = "point";
    table = "w_nicespots";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "LargeTrail") {
    urlend = "/w_pathbig";
    target = "line";
    table = "w_pathbig";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "Trail") {
    urlend = "/w_pathsmall";
    target = "line";
    table = "w_pathsmall";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "SmallTrail") {
    urlend = "/w_pathnondistinct";
    target = "line";
    table = "w_pathnondistinct";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "GreenTrail") {
    urlend = "/w_trailgreen";
    target = "line";
    table = "w_trailgreen";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "RedTrail") {
    urlend = "/w_trailhellas5";
    target = "line";
    table = "w_trailhellas5";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "BlueTrail") {
    urlend = "/w_traillake";
    target = "line";
    table = "w_traillake";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "PurpleTrail") {
    urlend = "/w_trailwhite";
    target = "line";
    table = "w_trailwhite";
  }
  else if ($("input[name='SearchChoice']:checked").val() == "DetailedRoads") {
    urlend = "/w_road";
    target = "line";
    table = "w_road";
  }
  console.log(table)
  $.ajax({
    url: 'http://localhost:3000/find',
    type: "POST",
    cache: false,
    contentType: "application/json",
    data: JSON.stringify({ //req body
      table: table
    }),
    success: function (res) {
      console.log(findFromPos, target, urlend, res);
      if (findFromPos) {
        console.log('find from position');

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);
          function success(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            if (target === "point") {
              createfoundpoints(latitude, longitude, "myPos");
            }
            else if (target === "line") {
              createfoundlines(latitude, longitude, "myPos");
            }
          }
          function error() {
            //Does nothing
          }
        }


      }
      else if (findFromPoint) {
        if (target === "point") {
          console.log('find from point');
          latitude = clickcoordinate[1];
          longitude = clickcoordinate[0];
          console.log(latitude, longitude)
          createfoundpoints(latitude, longitude, "clickedArray");
        }
        else if (target === "line") {
          //Do something

        }

      }

      //Not working yet
      else if (findFromTrail) {
        console.log('find from trail');
        //Do something
      }

      function createfoundpoints(latitude, longitude, fromArray) {
        searchResultArray.clear();
        clickedArray.clear();
        positionArray.clear();
        addPositionMarker(longitude, latitude, fromArray);
        for (var i in res) {
          console.log(latitude, longitude, res[i].latitude, res[i].longitude);
          //console.log(distance(latitude, longitude, res[i].lat, res[i].lon, "K"));
          if (distance(latitude, longitude, res[i].latitude, res[i].longitude, "K") < document.getElementById("dist").value) {
            //Point within distance! Yeey
            console.log('Point within distance Yeey!');
            addPositionMarker(res[i].longitude, res[i].latitude, "searchResult");
          }
        }
        //console.log(lat, lon);
        map.setView(new View({
          center: fromLonLat([longitude, latitude]),
          zoom: 14
        }))
      }
      function createfoundlines(latitude, longitude, fromArray) {
        searchResultArray.clear();
        clickedArray.clear();
        positionArray.clear();
        addPositionMarker(longitude, latitude, fromArray);
        console.log(res);
        var list_Feat = jsonAnswerDataToListElements(res);
        var line_data = {
          "type": "FeatureCollection",
          //"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::3857" } },
          "features": list_Feat
        }
        console.log(line_data)
        searchTrailArray.addFeatures(new ol.format.GeoJSON().readFeatures(line_data, { featureProjection: 'EPSG: 3857' }))
        /*console.log(positionArray.features);
        console.log(positionArray.geometry, line_data.features[1].geometry.distanceTo(pointFeature.geometry), document.getElementById("dist").value);
        for (var i = 1; i <= line_data.features.length - 1; i++) {
          if (line_data.features[i].geometry.distanceTo(pointFeature.geometry) < document.getElementById("dist").value) {
            largeTrailArray.addFeatures(new ol.format.GeoJSON().readFeatures(line_data, {featureProjection: 'EPSG: 3857' }));
            console.log("Test!" + largeTrail);
            break
          }
        }*/
        map.setView(new View({
          center: fromLonLat([longitude, latitude]),
          zoom: 14
        }))
      }

    }
  });
}
function distance(lat1, lon1, lat2, lon2, unit) {
  //console.log(lat1);
  var radlat1 = Math.PI * lat1 / 180;
  var radlat2 = Math.PI * lat2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //console.log(dist);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") { dist = dist * 1.609344 };
  if (unit == "N") { dist = dist * 0.8684 };
  return dist
}
function jsonAnswerDataToListElements(json_answer) {
  var data = json_answer;
  var n = data.length;
  var r = []
  for (var i = 0; i < n; ++i) {
    var row = data[i];
    var geomJson = $.parseJSON(row.st_asgeojson);
    r.push(geomJson);
  }
  return r;
}
//-------------------------------------------------------------------------------------------------------------------------------------------
//----VIEW LAYERS--------------------
// LOAD SMALL TRAILS-------------------------------
function loadSmallTrail(evt) {
  var req = $.ajax({
    url: "http://localhost:3000/w_pathnondistinct",
    type: "GET",
  });
  req.done(function (resp_json) {
    console.log(JSON.stringify(resp_json));
    var listaFeat = jsonAnswerDataToListElements(resp_json);
    var linjedata = {
      "type": "FeatureCollection",
      "features": listaFeat
    };
    smallTrailArray.addFeatures((new ol.format.GeoJSON()).readFeatures(linjedata, { featureProjection: 'EPSG: 3856' }));
  });
}
var noSmallTrails = true;
function showHideSmallTrails() {
  if (noSmallTrails) {
    loadSmallTrail();
  }
  else smallTrailArray.clear()
  noSmallTrails = !noSmallTrails;
}
//Triggers showHidesmallTrail function
var triggSmallTrails = document.getElementById("smalltrail");
triggSmallTrails.addEventListener("click", showHideSmallTrails);
//-----------------

//----- LOAD TRAILS---------------
function loadTrail(evt) {
  var req = $.ajax({
    url: "http://localhost:3000/w_pathsmall",
    type: "GET",
  });
  req.done(function (resp_json) {
    console.log(JSON.stringify(resp_json));
    var listaFeat = jsonAnswerDataToListElements(resp_json);
    var linjedata = {
      "type": "FeatureCollection",
      "features": listaFeat
    };
    trailArray.addFeatures((new ol.format.GeoJSON()).readFeatures(linjedata, { featureProjection: 'EPSG: 3856' }));
  });
}
var noTrails = true;
function showHideTrails() {
  if (noTrails) {
    loadTrail();
  }
  else trailArray.clear()
  noTrails = !noTrails;
}
//Triggers showHidesmallTrail function
var triggTrails = document.getElementById("trail");
triggTrails.addEventListener("click", showHideTrails);
//----------------------------------

//---------LOAD LARGE TRAILS
function loadLargeTrail(evt) {
  var req = $.ajax({
    url: "http://localhost:3000/w_pathbig",
    type: "GET",
  });
  req.done(function (resp_json) {
    console.log(JSON.stringify(resp_json));
    var listaFeat = jsonAnswerDataToListElements(resp_json);
    var linjedata = {
      "type": "FeatureCollection",
      "features": listaFeat
    };
    largeTrailArray.addFeatures((new ol.format.GeoJSON()).readFeatures(linjedata, { featureProjection: 'EPSG: 3856' }));
  });
}
var noLargeTrails = true;
function showHideLargeTrails() {
  if (noLargeTrails) {
    loadLargeTrail();
  }
  else largeTrailArray.clear()
  noLargeTrails = !noLargeTrails;
}
//Triggers showHidesmallTrail function
var triggLargeTrails = document.getElementById("largetrail");
triggLargeTrails.addEventListener("click", showHideLargeTrails);
//--------------------------

//------LOAD ROADS----------
function loadRoads(evt) {
  var req = $.ajax({
    url: "http://localhost:3000/w_road",
    type: "GET",
  });
  req.done(function (resp_json) {
    console.log(JSON.stringify(resp_json));
    var listaFeat = jsonAnswerDataToListElements(resp_json);
    var linjedata = {
      "type": "FeatureCollection",
      "features": listaFeat
    };
    roadsArray.addFeatures((new ol.format.GeoJSON()).readFeatures(linjedata, { featureProjection: 'EPSG: 3856' }));
  });
}
var noRoads = true;
function showHideRoads() {
  if (noRoads) {
    loadRoads();
  }
  else roadsArray.clear()
  noRoads = !noRoads;
}
//Triggers showHidesmallTrail function
var triggRoads = document.getElementById("allroads");
triggRoads.addEventListener("click", showHideRoads);
//-----------------

//------------------LOAD TRAIL BLUE---------

function loadBlueTrail(evt) {
  var req = $.ajax({
    url: "http://localhost:3000/w_traillake",
    type: "GET",
  });
  req.done(function (resp_json) {
    console.log(JSON.stringify(resp_json));
    var listaFeat = jsonAnswerDataToListElements(resp_json);
    var linjedata = {
      "type": "FeatureCollection",
      "features": listaFeat
    };
    blueTrailArray.addFeatures((new ol.format.GeoJSON()).readFeatures(linjedata, { featureProjection: 'EPSG: 3856' }));
  });
}
var noBlueTrails = true;
function showHideBlueTrails() {
  if (noBlueTrails) {
    loadBlueTrail();
  }
  else blueTrailArray.clear()
  noBlueTrails = !noBlueTrails;
}
//Triggers showHidesmallTrail function
var triggBlueTrails = document.getElementById("lakeblue");
triggBlueTrails.addEventListener("click", showHideBlueTrails);
//--------------------------

//----------LOAD GREEN TRAIL--------------
function loadGreenTrail(evt) {
  var req = $.ajax({
    url: "http://localhost:3000/w_trailgreen",
    type: "GET",
  });
  req.done(function (resp_json) {
    console.log(JSON.stringify(resp_json));
    var listaFeat = jsonAnswerDataToListElements(resp_json);
    var linjedata = {
      "type": "FeatureCollection",
      "features": listaFeat
    };
    greenTrailArray.addFeatures((new ol.format.GeoJSON()).readFeatures(linjedata, { featureProjection: 'EPSG: 3856' }));
  });
}
var noGreenTrails = true;
function showHideGreenTrails() {
  if (noGreenTrails) {
    loadGreenTrail();
  }
  else greenTrailArray.clear()
  noGreenTrails = !noGreenTrails;
}
//Triggers showHidesmallTrail function
var triggGreenTrails = document.getElementById("green");
triggGreenTrails.addEventListener("click", showHideGreenTrails);
//--------------------------

//-----------LOAD RED TRAIL-------------

function loadRedTrail(evt) {
  var req = $.ajax({
    url: "http://localhost:3000/w_trailhellas5",
    type: "GET",
  });

  req.done(function (resp_json) {
    console.log(resp_json);
    console.log(JSON.stringify(resp_json));
    var listaFeat = jsonAnswerDataToListElements(resp_json);
    var linjedata = {
      "type": "FeatureCollection",
      "features": listaFeat
    };
    redTrailArray.addFeatures((new ol.format.GeoJSON()).readFeatures(linjedata, { featureProjection: 'EPSG: 3857' }));
  });
}
var noRedTrails = true;
function showHideRedTrails() {
  if (noRedTrails) {
    loadRedTrail();
  }
  else redTrailArray.clear()
  noRedTrails = !noRedTrails;
}
//Triggers showHidesmallTrail function
var triggRedTrails = document.getElementById("hellas5red");
triggRedTrails.addEventListener("click", showHideRedTrails);
//------------------------------

//-----LOAD PURPLE TRAIL------------
function loadPurpleTrail(evt) {
  var req = $.ajax({
    url: "http://localhost:3000/w_trailwhite",
    type: "GET",
  });
  req.done(function (resp_json) {
    console.log(JSON.stringify(resp_json));
    var listaFeat = jsonAnswerDataToListElements(resp_json);
    var linjedata = {
      "type": "FeatureCollection",
      "features": listaFeat
    };
    purpleTrailArray.addFeatures((new ol.format.GeoJSON()).readFeatures(linjedata, { featureProjection: 'EPSG: 3856' }));
  });
}
var noPurpleTrails = true;
function showHidePurpleTrails() {
  if (noPurpleTrails) {
    loadPurpleTrail();
  }
  else purpleTrailArray.clear()
  noPurpleTrails = !noPurpleTrails;
}
//Triggers showHidesmallTrail function
var triggPurpleTrails = document.getElementById("whitepurple");
triggPurpleTrails.addEventListener("click", showHidePurpleTrails);
//---------------------------------------------------------





//--------------------------------------------------------------------FUNCTION FOR VIEW LAYER-------------------------------------------------------------//


//-------------------------------------------------------------------- FUNCTIONS FOR SIGN OUT USER
//Signs out the current user
function signOutUsr() {
  var request = $.ajax({
    url: 'http://localhost:3000/signoutusr',
    type: "POST",
    cache: true,
    contentType: "application/json"
  });
}
//Triggers signOutUsr when clicking on Sign out
var sou = document.getElementById("signoutusr");
if (sou) {
  sou.addEventListener("click", signOutUsr, false);
}

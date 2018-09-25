
import 'ol/ol.css';
import { fromLonLat, toLonLat, transform } from 'ol/proj';
import { Map, View } from 'ol';
import Draw from 'ol/interaction/Draw.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import * as style from 'ol/style';
import Feature from 'ol/Feature';
//import Point from 'ol/geom/Point';
//import {Icon, Style,Circle} from 'ol/style.js';
import { defaults as defaultControls, ZoomToExtent } from 'ol/control.js';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import { LineString, Point } from 'ol/geom.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';

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
            color: 'rgba(32,178,170,0.65)'
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
    target: 'map',
    layers: [layer, vector],
    view: new View({
        center: fromLonLat([18.476403, 57.530952]),
        zoom: 9
    }),
});


//Declaring global variables and default values
//Find section
var findFromPos = true;
var findFromPoint = false;
var findFromTrail = false;
var latitude;
var longitude;
var lat1 = 1;
var lon1 = 2;
var lat2;
var lon2;
var unit;


var b = document.getElementById("button");
b.addEventListener("click", load);


function addMarker(lon, lat) {
    //console.log('lon:', lon);
    //console.log('lat:', lat);
    //var iconFeatures = [];
    var iconFeature = new Feature({
        geometry: new Point(transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
    });
    markerSource.addFeature(iconFeature);
}

/*function geoFindMeSearch() {
    var output = document.getElementById("out");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
        function success(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            addMarker(longitude, latitude);
            //console.log(latitude, longitude);
            return [longitude, latitude];
        }
    }
    function error() {
        output.innerHTML = "Unable to retrieve your location";
    }
}*/


function load(event) {
    var latitude;
    var longitude;
    console.log('from chosen layer'); //klienten
    $.ajax({
        url: 'http://localhost:3000/coord',
        type: 'GET',

        success: function (res) {
            // console.log(res);
            // var ajaxDisplay = document.getElementById(map);
            //                   ajaxDisplay.innerHTML = html
            var output = document.getElementById("out");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
                function success(position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    markerSource.clear();
                    addMarker(longitude, latitude);
                    //console.log(latitude, longitude);
                    for (var i in res) {
                        console.log(latitude, longitude, res[i].lat, res[i].lon);
                        //console.log(distance(latitude, longitude, res[i].lat, res[i].lon, "K"));
                        if (distance(latitude, longitude, res[i].lat, res[i].lon, "K") < document.getElementById("distance").value) {
                            //Point within distance! Yeey
                            console.log('Point within distance Yeey!');
                            addMarker(res[i].lon, res[i].lat);
                        }
                    }
                    //console.log(lat, lon);
                    map.setView(new View({
                        center: fromLonLat([longitude, latitude]),
                        zoom: 10
                    }))
                }
                function error() {
                    output.innerHTML = "Unable to retrieve your location";
                }
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


import 'ol/ol.css';
import { fromLonLat, toLonLat, transform } from 'ol/proj';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import Feature from 'ol/Feature';
import { LineString, Point } from 'ol/geom.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';

//------------------- CREATES MAP AND LAYERS -------------------
//Creates a vector source
var markerSource = new VectorSource();
var pointSource = new VectorSource();
var lineSource = new VectorSource();

//Defiens marke style
var markerStyle = new Style({
    image: new ol.style.Circle({
        radius: 7,
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'green'
        })
    })
});

var pointStyle = new Style({
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

var lineStyle = new Style({
    stroke: new Stroke({
        color: 'red',
        width: 1
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

var pointvector = new VectorLayer({
    source: pointSource,
    style: pointStyle
});

var linevector = new VectorLayer({
    source: lineSource,
    style: lineStyle
});

//Definas a map
var map = new Map({
    // controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
    // interactions: ol.interaction.defaults({DoubleClickZoom :false}),
    //target : document.getElementById('map'),
    target: 'map',
    layers: [layer, linevector, pointvector, vector],
    view: new View({
        center: fromLonLat([18.476403, 57.530952]),
        zoom: 9
    }),
});


//Declaring global variables and default values
//Find section
var findFromPos = false;
var findFromPoint = true;
var findFromTrail = false;
var latitude;
var longitude;
var clickcoordinate = [18.159, 59.290];
var urlend = '/test_wgs84_linje';
//'w_nicespots'
//'/test_wgs84_point'


var b = document.getElementById("button");
b.addEventListener("click", function () { findlines(urlend) });

map.on('singleclick', function (evt) {
    clickcoordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'); //map.getEventCoordinate(evt.originalEvent)
});

function addMarker(lon, lat) {
    var iconFeature = new Feature({
        geometry: new Point(transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
    });
    markerSource.addFeature(iconFeature);
}
function addMarkerpoint(lon, lat) {
    var iconFeature = new Feature({
        geometry: new Point(transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
    });
    pointSource.addFeature(iconFeature);
}

function addTrail(geojson) {
    var lineFeature = new Feature({
        geometry: new LineString(transform(geojson, 'EPSG:4326', 'EPSG:3857'))
    });
    lineSource.addFeature(lineFeature);

    function findpoints(urlend) {
        $.ajax({
            url: 'http://localhost:3000' + urlend,
            type: 'GET',

            success: function (res) {
                console.log(res);
                if (findFromPos) {
                    console.log('find from position');
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(success, error);
                        function success(position) {
                            latitude = position.coords.latitude;
                            longitude = position.coords.longitude;
                            createfoundpoints(latitude, longitude);
                        }
                        function error() {
                            //Aint doin shit
                        }
                    }
                }
                else if (findFromPoint) {
                    console.log('find from point');
                    latitude = clickcoordinate[1];
                    longitude = clickcoordinate[0];
                    console.log(latitude, longitude)
                    createfoundpoints(latitude, longitude);
                }
                else if (findFromTrail) {
                    console.log('find from trail');
                    //Do something
                }

                function createfoundpoints(latitude, longitude) {

                    markerSource.clear();
                    pointSource.clear();
                    addMarker(longitude, latitude);

                    for (var i in res) {
                        console.log(latitude, longitude, res[i].latitude, res[i].longitude);
                        //console.log(distance(latitude, longitude, res[i].lat, res[i].lon, "K"));
                        if (distance(latitude, longitude, res[i].latitude, res[i].longitude, "K") < document.getElementById("distance").value) {
                            //Point within distance! Yeey
                            console.log('Point within distance Yeey!');
                            addMarkerpoint(res[i].longitude, res[i].latitude);
                        }
                    }
                    //console.log(lat, lon);
                    map.setView(new View({
                        center: fromLonLat([longitude, latitude]),
                        zoom: 10
                    }))
                }

            }
        });
    }
    function findlines(urlend) {
        $.ajax({
            url: 'http://localhost:3000' + urlend,
            type: 'GET',

            success: function (res) {
                console.log(res);
                if (findFromPos) {
                    console.log('find from position');
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(success, error);
                        function success(position) {
                            latitude = position.coords.latitude;
                            longitude = position.coords.longitude;
                            createfoundlines(latitude, longitude);
                        }
                        function error() {
                            //Aint doin shit
                        }
                    }
                }
                else if (findFromPoint) {
                    console.log('find from point');
                    latitude = clickcoordinate[1];
                    longitude = clickcoordinate[0];
                    console.log(latitude, longitude)
                    createfoundlines(latitude, longitude);
                }
                else if (findFromTrail) {
                    console.log('find from trail');
                    //Do something
                }

                function createfoundlines(latitude, longitude) {

                    markerSource.clear();
                    pointSource.clear();
                    addMarker(longitude, latitude);

                    for (var i in res) {
                        console.log(latitude, longitude, res[i].geometry);
                        //console.log(distance(latitude, longitude, res[i].lat, res[i].lon, "K"));
                        //if (distance(nånting) < document.getElementById("distance").value) {
                      
                            console.log('Line within distance Yeey!');
                            
                        //}
                    }
                    //console.log(lat, lon);
                    map.setView(new View({
                        center: fromLonLat([longitude, latitude]),
                        zoom: 10
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

//Imports to enable creation of OpenLayerMap
import 'ol/ol.css';
import {fromLonLat, toLonLat,transform} from 'ol/proj';
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {BingMaps, OSM, Vector as VectorSource} from 'ol/source.js';

//Creates a base map - open street map
var roads = new TileLayer({
  source: new OSM()
});

//Creates a satellite map - open street layer
var satellite = new TileLayer({
  source: new BingMaps({key: 'Av5H9QA0C4Tkx7t4ixpe2y39YvWcmCMzLBu3mJT-hU44U5z12GqTGd7KO-WF_S3V', imagerySet: 'Aerial'})
});

//Definas the map
var map = new Map({
  target : 'map',
  layers: [roads],
  view: new View({
    center: fromLonLat([18.160513,59.289951]),
    zoom: 15
  }),
});

//Changes the map to satellite imagery
var Satellite = document.getElementById("ChangeSatellite");
Satellite.addEventListener("click", SatImg);
  function SatImg(){
    map.removeLayer(roads);
    map.addLayer(satellite);
  }

//Changes the map to regular road map
var RegMap = document.getElementById("ChangeRoads");
RegMap.addEventListener("click", RoadMap);
  function RoadMap(){
    map.removeLayer(satellite);
    map.addLayer(roads);
  }
//Imports to enable creation of OpenLayerMap
import 'ol/ol.css';
import {fromLonLat, toLonLat,transform} from 'ol/proj';
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';

//Creates a base map - open street map
var layer = new TileLayer({
  source: new OSM()
});

//Definas a map
var map = new Map({
  target : 'map',
  layers: [layer],
  view: new View({
    center: fromLonLat([18.160513,59.289951]),
    zoom: 15
  }),
});

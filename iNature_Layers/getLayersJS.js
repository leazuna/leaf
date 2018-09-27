//import 'ol/ol.css';
//import GeoJSON from 'ol/format/GeoJSON.js';
//import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
//import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
//import VectorSource from 'ol/source/Vector.js';
//import {Stroke, Style} from 'ol/style.js';


//var vectorSource = new VectorSource({
  //format: new GeoJSON(),
  //url: function(extent) {
    //return 'http://localhost:8080/geoserver/FA_AH_LZ_EO/ows?service=WFS&' +
      //  'version=1.1.0&request=GetFeature&typename=osm:FA_AH_LZ_EO:w_bathmade' +
        //'outputFormat=application/json&srsname=EPSG:3011&' +
        //'bbox=' + extent.join(',') + ',EPSG:3011';
 // },
  //strategy: bboxStrategy
//});


//var vector = new VectorLayer({
 // source: vectorSource,
  //style: new Style({
  //  stroke: new Stroke({
    //  color: 'rgba(0, 0, 255, 1.0)',
   //   width: 2
   // })
 // })
//});


//Changes the map to satellite imagery
var Bathingsite = document.getElementById("Add BathingSite");
Bathingsite.addEventListener("click", BathSite);
  function BathSite(){
    map.addLayer(satellite);
  }


        import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import {
        equalTo as equalToFilter,
        like as likeFilter,
        and as andFilter
      } from 'ol/format/filter.js';
      import {WFS, GeoJSON} from 'ol/format.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import BingMaps from 'ol/source/BingMaps.js';
      import VectorSource from 'ol/source/Vector.js';
      import {Stroke, Style} from 'ol/style.js';


      var vectorSource = new VectorSource();
      var vector = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0, 0, 255, 1.0)',
            width: 2
          })
        })
      });

      // generate a GetFeature request
      var featureRequest = new WFS().writeGetFeature({
        srsName: 'EPSG:3857',
        featureNS: 'http://openstreemap.org',
        featurePrefix: 'osm',
        featureTypes: ['water_areas'],
        outputFormat: 'application/json',
        filter: andFilter(
          likeFilter('name', 'Mississippi*'),
          equalToFilter('waterway', 'riverbank')
        )
      });

      // then post the request and add the received features to a layer
      fetch('http://localhost:8080/geoserver/FA_AH_LZ_EO/ows?service=WFS&', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
      }).then(function(response) {
        return response.json();
      }).then(function(json) {
        var features = new GeoJSON().readFeatures(json);
        vectorSource.addFeatures(features);
        map.getView().fit(vectorSource.getExtent());
      });

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
/*var layer = new TileLayer({
  source: new OSM()
});*/

//Definas a map
/*var map = new Map({
  // controls: ol.control.defaults().extend([new ol.control.FullScreen()]),
  // interactions: ol.interaction.defaults({DoubleClickZoom :false}),
  //target : document.getElementById('map'),
  target : 'map',
  layers: [layer],
  view: new View({
    center: fromLonLat([18.476403,57.530952]),
    zoom: 9
  }),
});*/


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

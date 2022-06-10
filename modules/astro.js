import * as AA from "./astronomical-algorithms.js";
import * as Inputs from "./inputs.js";

let lat = new Inputs.InputTextDMSHMS("divlat", "0.0", true),
    lon = new Inputs.InputTextDMSHMS("divlon", "0.0", true),
    ra = new Inputs.InputTextDMSHMS("divra", "0.0", false),//false car HMS
    dec = new Inputs.InputTextDMSHMS("divdec", "0.0", true),

    localsideraltime = document.getElementById("localsideraltime"),
    hourangle = document.getElementById("hourangle"),
    azimuth = document.getElementById("azimuth"),
    hauteur = document.getElementById("hauteur");

let map = new ol.Map({
  layers: [
    new ol.layer.Tile({source: new ol.source.OSM()})
  ],
  view: new ol.View({
    center: [433302,6522073],
    zoom: 4
  }),
  target: 'map'
});

map.on('singleclick', function (evt) {
  var epsg4326LongLat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

  if(epsg4326LongLat[1] < 0){
  epsg4326LongLat[1] = - epsg4326LongLat[1];
  document.getElementById("hemisphere").checked = false;
  }
  else {
  document.getElementById("hemisphere").checked = true;
  }
  lat.setValue(epsg4326LongLat[1]);
  lat.changeDegre();

  if(epsg4326LongLat[0] < 0){
  epsg4326LongLat[0] = - epsg4326LongLat[0];
  document.getElementById("greenwichmeridian").checked = false;
  }
  else {
  document.getElementById("greenwichmeridian").checked = true;
  }
  lon.setValue(epsg4326LongLat[0]);
  lon.changeDegre();
});
    
mainLoop();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mainLoop() {
  var lst,
      ha,
      azimutalCoordinates;
  
  while(true) {        
    await sleep(1000);
    
    lst = AA.Algorithms.localSideralTime(parseFloat(lon.getValue()) * (document.getElementById("greenwichmeridian").checked ? 1 : -1) );
    localsideraltime.innerText = AA.Algorithms.degreeToHMS(lst);
    
    ha = lst - parseFloat(ra.getValue());
    hourangle.innerText = AA.Algorithms.degreeToHMS(ha);

    azimutalCoordinates = AA.Algorithms.equatorialToAzimutal(
                              ha, 
                              parseFloat(lat.getValue()) * (document.getElementById("hemisphere").checked ? 1 : -1),
                              parseFloat(dec.getValue()) * (document.getElementById("dechemisphere").checked ? 1 : -1)
                              );
    azimuth.innerText = azimutalCoordinates.A;
    hauteur.innerText = azimutalCoordinates.h >= 0 ? azimutalCoordinates.h : "sous l'horizon (" + azimutalCoordinates.h + ")";
  }
}


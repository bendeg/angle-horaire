import * as AA from "./astronomical-algorithms.js";
import * as Inputs from "./inputs.js";
import * as Map from "./map.js"

const geolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
};

let date_options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric"/* ,
  timeZone: "Europe/Brussels",
  timeZoneName: "short" */
};

let now,
    checkboxnow = document.getElementById("datetime"),
    datetimeyear = document.getElementById("datetimeyear"),
    datetimemonth = document.getElementById("datetimemonth"),
    datetimeday = document.getElementById("datetimeday"),
    datetimehour = document.getElementById("datetimehour"),
    datetimeminute = document.getElementById("datetimeminute"),
    datetimesecond = document.getElementById("datetimesecond"),
    manualgeolocation = document.getElementById("checkgeolocation"),
    lat = new Inputs.InputTextDMSHMS("divlat", "0.0", true),
    lon = new Inputs.InputTextDMSHMS("divlon", "0.0", true),
    ra = new Inputs.InputTextDMSHMS("divra", "0.0", false),//false car HMS
    dec = new Inputs.InputTextDMSHMS("divdec", "0.0", true),
    localsideraltime = document.getElementById("localsideraltime"),
    hourangle = document.getElementById("hourangle"),
    azimuth = document.getElementById("azimuth"),
    hauteur = document.getElementById("hauteur"),
    
    ut = document.getElementById("ut"),
    deltat = document.getElementById("deltat"),
    td = document.getElementById("td");

let map = Map.getMap([433302, 6522073]);

checkboxnow.checked = true;

if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(geolocationAvailable, geolocationNotAvailable, geolocationOptions);
}

function geolocationAvailable(position) {
  lat.setValue(position.coords.latitude);
  lat.changeDegre();
  lon.setValue(position.coords.longitude);
  lon.changeDegre();
  map.getView().setCenter(ol.proj.transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857'), 8);
}

function geolocationNotAvailable() {
  alert("Géolocalisation indisponible");
}

map.on('singleclick', function (evt) {
  var epsg4326LongLat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

  map.getView().setCenter(evt.coordinate, 0);

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

map.on('singleclick', disableManualGeolocation);
map.on('pointerdrag', disableManualGeolocation);

function disableManualGeolocation() {
  manualgeolocation.checked = false;
}

//tests();
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

    if(checkboxnow.checked) {
      now = new Date(Date.now());
      datetimeyear.value = now.getFullYear();
      datetimemonth.value = now.getMonth() + 1;
      datetimeday.value = now.getDate();
      datetimehour.value = now.getHours();
      datetimeminute.value = now.getMinutes();
      datetimesecond.value = now.getSeconds();
    }
    else {
      now = new Date(parseInt(datetimeyear.value),
                     parseInt(datetimemonth.value) - 1,
                     parseInt(datetimeday.value),
                     parseInt(datetimehour.value),
                     parseInt(datetimeminute.value),
                     parseInt(datetimesecond.value));
      //console.log(now);
    }

    if(manualgeolocation.checked) {
      map.getView().setCenter(ol.proj.transform(
                                              [lon.getValue() * (document.getElementById("greenwichmeridian").checked ? 1 : -1),
                                              lat.getValue() * (document.getElementById("hemisphere").checked ? 1 : -1)],
                                               'EPSG:4326', 'EPSG:3857'), 8);
    }

    ut.innerText = AA.Algorithms.ut(now.getFullYear(),
                                    now.getMonth() + 1,
                                    now.getDate(),
                                    now.getHours(),
                                    now.getMinutes(),
                                    now.getSeconds()).toLocaleString('fr-BE', date_options);

    ut.innerText = AA.Algorithms.ut(now.getFullYear(),
                                    now.getMonth() + 1,
                                    now.getDate(),
                                    now.getHours(),
                                    now.getMinutes(),
                                    now.getSeconds()).toLocaleString('fr-BE', date_options);

    deltat.innerText = AA.Algorithms.deltaT(now.getFullYear(),
                                            now.getMonth() + 1,
                                            now.getDate(),
                                            now.getHours(),
                                            now.getMinutes(),
                                            now.getSeconds());
    
    td.innerText = AA.Algorithms.td(now.getFullYear(),
                                    now.getMonth() + 1,
                                    now.getDate(),
                                    now.getHours(),
                                    now.getMinutes(),
                                    now.getSeconds()).toLocaleString('fr-BE', date_options);

    lst = AA.Algorithms.localSideralTime(parseFloat(lon.getValue()) * (document.getElementById("greenwichmeridian").checked ? 1 : -1), now);
    localsideraltime.innerText = AA.Algorithms.degreeToHMSDMS(lst, true, true);
    
    ha = lst - parseFloat(ra.getValue());
    hourangle.innerText = AA.Algorithms.degreeToHMSDMS(ha, true, true);
    azimutalCoordinates = AA.Algorithms.equatorialToAzimutal(
                              ha, 
                              parseFloat(lat.getValue()) * (document.getElementById("hemisphere").checked ? 1 : -1),
                              parseFloat(dec.getValue()) * (document.getElementById("dechemisphere").checked ? 1 : -1)
                              );
    azimuth.innerText = azimutalCoordinates.A;
    hauteur.innerText = azimutalCoordinates.h >= 0 ? azimutalCoordinates.h : "sous l'horizon (" + azimutalCoordinates.h + ")";
  }
}

function tests() {
  var maintenant = new Date(Date.now());
  /*
  console.log(AA.Algorithms.deltaT(
  maintenant.getUTCFullYear(),
  maintenant.getUTCMonth() + 1,
  maintenant.getUTCDate(),
  maintenant.getUTCHours(),
  maintenant.getUTCMinutes(),
  maintenant.getUTCSeconds())
  ); */

  console.log(AA.Algorithms.td(
    333,
    2,
    6,
    6,
    0,
    0
    ));

console.log("GM+1 -> UT : " + new Date(
  maintenant.getUTCFullYear(),
  maintenant.getUTCMonth() + 1,
  maintenant.getUTCDate(),
  maintenant.getUTCHours(),
  maintenant.getUTCMinutes(),
  maintenant.getUTCSeconds()));
}
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


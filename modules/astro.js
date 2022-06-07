import * as AA from "./astronomical-algorithms.js";
import * as Inputs from "./inputs.js";

let latitude,
    longitude,
    rightAscension,
    declination,

    latdegdec = new Inputs.InputText("latdeg", "divlatdeg", "0.0", changeLatitudeDegre),
    latdegd = new Inputs.InputText("latdegd", "divlatd", "0", changeLatitudeDMS),
    latdegm = new Inputs.InputText("latdegm", "divlatm", "0", changeLatitudeDMS),
    latdegs = new Inputs.InputText("latdegs", "divlats", "0.0", changeLatitudeDMS),

    londegdec = document.getElementById("londegdec"),
    londegsexd = document.getElementById("londegsexd"),
    londegsexm = document.getElementById("londegsexm"),
    londegsexs = document.getElementById("londegsexs"),

    addeg = document.getElementById("addeg"),
    adh = document.getElementById("adh"),
    adm = document.getElementById("adm"),
    ads = document.getElementById("ads"),

    decdeg = document.getElementById("decdeg"),
    decd = document.getElementById("decd"),
    decm = document.getElementById("decm"),
    decs = document.getElementById("decs"),

    localsideraltime = document.getElementById("localsideraltime"),
    hourangle = document.getElementById("hourangle"),
    azimuth = document.getElementById("azimuth"),
    hauteur = document.getElementById("hauteur");

londegdec.oninput = changeLongitudeDegre;
londegsexd.oninput = changeLongitudeDMS;
londegsexm.oninput = changeLongitudeDMS;
londegsexs.oninput = changeLongitudeDMS;

addeg.oninput = changeRADegre;
adh.oninput = changeRA;
adm.oninput = changeRA;
ads.oninput = changeRA;

decdeg.oninput = changeDECDegre;
decd.oninput = changeDEC;
decm.oninput = changeDEC;
decs.oninput = changeDEC;

changeLongitudeDegre();
changeLatitudeDegre();
changeRA();
changeDEC();
mainLoop();

function changeRADegre() {
  var temp = addeg.value / 15;

  rightAscension = addeg.value;

  adh.value = Math.trunc(temp);
  temp = (temp - adh.value) * 60;
  adm.value = Math.trunc(temp);
  ads.value = (temp - adm.value) * 60;
}

function changeRA() { 
  rightAscension = Math.trunc(parseFloat(adh.value)) * 15
      + Math.trunc(parseFloat(adm.value)) / 60 * 15
      + parseFloat(ads.value) / 3600 * 15;

  addeg.value = rightAscension;
}

function changeDECDegre() {
  var temp = decdeg.value;

  decd.value = Math.trunc(temp);
  temp = (temp - decd.value) * 60;
  decm.value = Math.trunc(temp);
  decs.value = (temp - decm.value) * 60;
}

function changeDEC() { 
  declination = (
      Math.trunc(parseFloat(decd.value))
      + Math.trunc(parseFloat(decm.value)) / 60
      + parseFloat(decs.value) / 3600
      );
  
  decdeg.value = declination;
}

function changeLongitudeDegre() {
  var temp, temptrunc;

  longitude = parseFloat(londegdec.value);

  temptrunc = Math.trunc(longitude);
  londegsexd.value = temptrunc;

  temp = (longitude - temptrunc) * 60;
  temptrunc = Math.trunc(temp);
  londegsexm.value = Math.trunc(temptrunc);

  temp = (temp - temptrunc) * 60;
  londegsexs.value = temp; 
}

function changeLongitudeDMS() {
  longitude = parseFloat(londegsexd.value) + parseFloat(londegsexm.value) / 60 + parseFloat(londegsexs.value) / 3600;
  
  londegdec.value = longitude;
}

function changeLatitudeDegre() {
  var temp, temptrunc;
  //latitude = parseFloat(latdegdec.value);
  latitude = parseFloat(latdegdec.getValue());

  temptrunc = Math.trunc(latitude);
  latdegd.setValue(temptrunc);

  temp = (latitude - temptrunc) * 60;
  temptrunc = Math.trunc(temp);
  latdegm.setValue(temptrunc);

  temp = (temp - temptrunc) * 60;
  latdegs.setValue(temp);  
}

function changeLatitudeDMS() {
  latitude = parseFloat(latdegd.getValue()) + parseFloat(latdegm.getValue()) / 60 + parseFloat(latdegs.getValue()) / 3600;
  
  latdegdec.setValue(latitude);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mainLoop() {
  var lst,
      ha,
      azimutalCoordinates;
  
  while(true) {        
    await sleep(1000);
    
    lst = AA.Algorithms.localSideralTime(longitude * (document.getElementsByName("greenwichmeridian")[1].checked ? 1 : -1) );
    localsideraltime.innerText = AA.Algorithms.degreeToHMS(lst);
    
    ha = lst - rightAscension;
    hourangle.innerText = AA.Algorithms.degreeToHMS(ha);

    azimutalCoordinates = AA.Algorithms.equatorialToAzimutal(
                              ha, 
                              latitude * (document.getElementsByName("hemisphere")[0].checked ? 1 : -1),
                              declination * (document.getElementsByName("dechemisphere")[0].checked ? 1 : -1)
                              );
    azimuth.innerText = azimutalCoordinates.A;
    hauteur.innerText = azimutalCoordinates.h >= 0 ? azimutalCoordinates.h : "sous l'horizon (" + azimutalCoordinates.h + ")";
  }
}

// function create(id, parent, width, height) {
//   let divrow = document.createElement('div');
//   let divcolLabel = document.createElement('div');

//   let canvasElem = document.createElement('canvas');
//   parent.appendChild(divrow);
//   divrow.appendChild(divcolLabel);
//   divWrapper.appendChild(canvasElem);

//   divrow.id = id;
//   divrow.className = "row border rounded mb-2 p-3";
//   divcolLabel.id = id + "-label";
//   divcolLabel.className = "col-md-6";
//   divcolLabel.innerHTML = "Test label";
//   canvasElem.width = width;
//   canvasElem.height = height;

//   let ctx = canvasElem.getContext('2d');

//   return {
//    ctx: ctx,
//    id: id
//   };
//   return divrow;
// }

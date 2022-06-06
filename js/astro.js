import * as AA from "../modules/astronomical-algorithms.js";

var latitude,
    longitude,
    rightAscension,
    declination;

var localsideraltime = document.getElementById("localsideraltime"),
    hourangle = document.getElementById("hourangle"),
    latdegdec = document.getElementById("latdegdec"),
    latdegsexd = document.getElementById("latdegsexd"),
    latdegsexm = document.getElementById("latdegsexm"),
    latdegsexs = document.getElementById("latdegsexs"),
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
    azimuth = document.getElementById("azimuth"),
    hauteur = document.getElementById("hauteur");

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
window.changeRADegre = changeRADegre;

function changeRA() { 
  rightAscension = Math.trunc(parseFloat(adh.value)) * 15
      + Math.trunc(parseFloat(adm.value)) / 60 * 15
      + parseFloat(ads.value) / 3600 * 15;

  addeg.value = rightAscension;
}
window.changeRA = changeRA;

function changeDECDegre() {
  var temp = decdeg.value;

  decd.value = Math.trunc(temp);
  temp = (temp - decd.value) * 60;
  decm.value = Math.trunc(temp);
  decs.value = (temp - decm.value) * 60;
}
window.changeDECDegre = changeDECDegre;

function changeDEC() { 
  declination = (
      Math.trunc(parseFloat(decd.value))
      + Math.trunc(parseFloat(decm.value)) / 60
      + parseFloat(decs.value) / 3600
      );
  
  decdeg.value = declination;
}
window.changeDEC = changeDEC;

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
window.changeLongitudeDegre = changeLongitudeDegre;

function changeLongitudeDMS() {
  longitude = parseFloat(londegsexd.value) + parseFloat(londegsexm.value) / 60 + parseFloat(londegsexs.value) / 3600;
  
  londegdec.value = longitude;
}
window.changeLongitudeDMS = changeLongitudeDMS;

function changeLatitudeDegre() {
  var temp, temptrunc;

  latitude = parseFloat(latdegdec.value);

  temptrunc = Math.trunc(latitude);
  latdegsexd.value = temptrunc;

  temp = (latitude - temptrunc) * 60;
  temptrunc = Math.trunc(temp);
  latdegsexm.value = Math.trunc(temptrunc);

  temp = (temp - temptrunc) * 60;
  latdegsexs.value = temp;
  
}
window.changeLatitudeDegre = changeLatitudeDegre;

function changeLatitudeDMS() {
  latitude = parseFloat(latdegsexd.value) + parseFloat(latdegsexm.value) / 60 + parseFloat(latdegsexs.value) / 3600;
  
  latdegdec.value = latitude;
}
window.changeLatitudeDMS = changeLatitudeDMS;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mainLoop() {
  var lst,
      ha,
      A,
      h;
  
  while(true) {        
    await sleep(1000);
    
    lst = AA.localSideralTime(longitude * (document.getElementsByName("greenwichmeridian")[0].checked ? 1 : -1) );
    localsideraltime.innerText = AA.degreeToHMS(lst);
    ha = lst - rightAscension;
    hourangle.innerText = AA.degreeToHMS(ha);
    
    A = (Math.atan2(
      Math.sin(ha * Math.PI / 180),
      Math.cos(ha * Math.PI / 180) * Math.sin(latitude  * (document.getElementsByName("hemisphere")[0].checked ? 1 : -1) * Math.PI / 180)
      - Math.tan(declination * (document.getElementsByName("dechemisphere")[0].checked ? 1 : -1) * Math.PI / 180) * Math.cos(latitude  * (document.getElementsByName("hemisphere")[0].checked ? 1 : -1) * Math.PI / 180)
      ) * 180 / Math.PI + 180) % 360;
    
    if(A < 0) A += 360;
    
    azimuth.innerText = A;
    
    h = Math.asin(Math.sin(latitude  * (document.getElementsByName("hemisphere")[0].checked ? 1 : -1) * Math.PI / 180) * Math.sin(declination * (document.getElementsByName("dechemisphere")[0].checked ? 1 : -1) * Math.PI / 180)
                + Math.cos(latitude  * (document.getElementsByName("hemisphere")[0].checked ? 1 : -1) * Math.PI / 180)
                  * Math.cos(declination * (document.getElementsByName("dechemisphere")[0].checked ? 1 : -1) * Math.PI / 180)
                  * Math.cos(ha * Math.PI / 180)
        ) * 180 / Math.PI;
    
    hauteur.innerText = h >= 0 ? h : "sous l'horizon (" + h + ")";
  }
}



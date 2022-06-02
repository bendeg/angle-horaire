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

  latitude = parseFloat(latdegdec.value);

  temptrunc = Math.trunc(latitude);
  latdegsexd.value = temptrunc;

  temp = (latitude - temptrunc) * 60;
  temptrunc = Math.trunc(temp);
  latdegsexm.value = Math.trunc(temptrunc);

  temp = (temp - temptrunc) * 60;
  latdegsexs.value = temp;
  
}

function changeLatitudeDMS() {
  latitude = parseFloat(latdegsexd.value) + parseFloat(latdegsexm.value) / 60 + parseFloat(latdegsexs.value) / 3600;
  
  latdegdec.value = latitude;
}

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
    
    lst = localSideralTime(longitude * (document.getElementsByName("greenwichmeridian")[0].checked ? 1 : -1) );
    localsideraltime.innerText = degreeToHMS(lst);
    ha = lst - rightAscension;
    hourangle.innerText = degreeToHMS(ha);
    
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

function localSideralTime(longitude) {
  var datetime = new Date(Date.now()), 
      Y = datetime.getUTCFullYear(),
      M = datetime.getUTCMonth() + 1,//en javascript : janvier = 0 !
      D = datetime.getUTCDate(),
      h = datetime.getUTCHours(),
      m = datetime.getUTCMinutes(),
      s = datetime.getUTCSeconds();

  D += h / 24 + m / 60 / 24 + s / 3600 / 24;//pour avoir la fraction du jour sous forme décimale

  return sideralTimeGreewich(julianDay(D, M, Y)) + longitude;// longitude > 0 --> Est
}

function julianDay(D, M, Y) {
  var A, B;

  if(M <= 2) {
    M += 12;
    Y -= 1;
  }

  A = Math.trunc(Y / 100);

  if(Y < 1582) B = 0;//si l'année est une date dans le calendrier julien
  else B = Math.trunc(2 - A + Math.trunc(A / 4));
  
  return  Math.trunc(365.25 * (Y + 4716))
        + Math.trunc(30.6001 * (M + 1))
        + D + B - 1524.5;
}

function sideralTimeGreewich(julianday) {
  var T     = (julianday - 2451545.0) / 36525,
      temp  = (
              + 280.46061837
              + 360.98564736629 * (julianday - 2451545)
              + 0.000387933 * T * T
              - (T * T * T) / 38710000
              ) % 360;//opération modulo peut donner un résultat négatif...

  if(temp < 0) temp += 360;//...si c'est le cas, ajouter 360°
  
  return temp;
}

function degreeToHMS(degreeDecimal) {
  var string  = "",
      temp    = degreeDecimal % 360;

  if(temp < 0) temp += 360;

  temp /= 15;
  string += String(Math.trunc(temp)).padStart(2, '0') + ":";
  temp = 60 * (temp - Math.trunc(temp));
  string += String(Math.trunc(temp)).padStart(2, '0') + ":"
  temp = 60 * (temp - Math.trunc(temp));
  string += String(temp.toFixed(0)).padStart(2, '0');
  
  return string
}
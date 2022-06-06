export function localSideralTime(longitude) {
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

export function julianDay(D, M, Y) {
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

export function sideralTimeGreewich(julianday) {
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

export function degreeToHMS(degreeDecimal) {
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
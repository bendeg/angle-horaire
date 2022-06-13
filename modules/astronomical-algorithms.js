export class Algorithms {

  static localSideralTime(longitude, datetime = new Date(Date.now())) {
    var Y = datetime.getUTCFullYear(),
        M = datetime.getUTCMonth() + 1,//en javascript : janvier = 0 !
        D = datetime.getUTCDate(),
        h = datetime.getUTCHours(),
        m = datetime.getUTCMinutes(),
        s = datetime.getUTCSeconds();

    D += h / 24 + m / 60 / 24 + s / 3600 / 24;//pour avoir la fraction du jour sous forme décimale

    return Algorithms.sideralTimeGreewich(Algorithms.julianDay(D, M, Y)) + longitude;// longitude > 0 --> Est
  }

  static julianDay(D, M, Y) {
    var A, B;

    if(M <= 2) {
      M += 12;
      Y -= 1;
    }

    A = Math.trunc(Y / 100);

    if(Y < 1582) B = 0;//si l'année est une année du calendrier julien
    else B = Math.trunc(2 - A + Math.trunc(A / 4));
    
    return  Math.trunc(365.25 * (Y + 4716))
          + Math.trunc(30.6001 * (M + 1))
          + D + B - 1524.5;
  }

  static sideralTimeGreewich(julianday) {
    var T     = (julianday - 2451545.0) / 36525,
        stg  = (
                + 280.46061837
                + 360.98564736629 * (julianday - 2451545)
                + 0.000387933 * T * T
                - (T * T * T) / 38710000
                ) % 360;//opération modulo peut donner un résultat négatif...

    if(stg < 0) stg += 360;//...si c'est le cas, ajouter 360°
    
    return stg;
  }

  static equatorialToAzimutal(ha, latitude, declination) {
    var A = (
                Math.atan2(
                  Math.sin(ha * Math.PI / 180),
                  Math.cos(ha * Math.PI / 180) * Math.sin(latitude * Math.PI / 180)
                    - Math.tan(declination * Math.PI / 180) * Math.cos(latitude * Math.PI / 180)
                ) * 180 / Math.PI + 180
            ) % 360;
    
    if(A < 0) A += 360;

    var h = Math.asin(
            Math.sin(latitude * Math.PI / 180) * Math.sin(declination * Math.PI / 180)
            + Math.cos(latitude * Math.PI / 180)
              * Math.cos(declination * Math.PI / 180)
              * Math.cos(ha * Math.PI / 180)
          ) * 180 / Math.PI;
    
    return {
      A : A,
      h : h
    };
  }

  static degreeToHMSDMS(degreeDecimal, toHMS = true, toString = true) {
    var string  = "",
        h = degreeDecimal % 360, m, s,
        ratioHMSDMS = toHMS ? 15 : 1;

    if(h < 0) h += 360;

    h /= ratioHMSDMS;
    string += String(Math.trunc(h)).padStart(2, '0') + ":";
    
    m = 60 * (h - Math.trunc(h));
    string += String(Math.trunc(m)).padStart(2, '0') + ":"
    
    s = 60 * (m - Math.trunc(m));
    string += String(s.toFixed(0)).padStart(2, '0');
    
    if(toString)
      return string;
    else 
      return {
        h: Math.trunc(h),
        m: Math.trunc(m),
        s: s
      };
  }
}
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

  static deltaT(year, month, day, hour, minute, second) {
    //ATTENTION : pas encore défini pour les années suivantes :
    // 1600.0 < année < 1800.0
    // 1997.0 < année < 2000.0
    // voir table 10.A, page 79

    let hourDecimal = hour 
                    + (minute / 60) + (second /3600),
        dayDecimal = day 
                    + (hourDecimal / 24),
        yearDecimal = year
                    + (month / 24)
                    + (dayDecimal / 365.25),
        t = (yearDecimal - 2000) / 100;
    
    //console.log(t);
    
    // <-- 948
    if( (yearDecimal < 948) ) {
      // =  2177 + 497t + 44.1t²
      //console.log("avant +948");
      return this.polynomial([2177, 497, 44.1], t)
    }

    // 948 --> <-- 1600 OU ( 2000 --> ET 2000 --> <-- 2100 )
    if( ((yearDecimal >= 948) && (yearDecimal <= 1600))
      ||
      ((yearDecimal >= 2000) && (yearDecimal <= 2100)) ){
      //console.log("entre 2000 et 2100, t = " +t);
      return this.polynomial([102, 102, 25.3], t)
             + (0.37 * (yearDecimal - 2100));
    }
    
    t = (yearDecimal - 1900) / 100;
    // 1800 --> <-- 1997 (erreur max : 2.3 secondes)
    if( (yearDecimal >= 1800)
        && (yearDecimal <= 1997)
      )
      if( yearDecimal < 1900 ) {
        // 1800 --> <-- 1899 (erreur max : 0.9 secondes)
        return this.polynomial([-2.50, +228.95, +5218.61, +56282.84, +324011.78,
          +1061660.75, +2087298.89, +2513807.78,
          + 1818961.41, +727058.63, +123563.95], t);
      }
      else {
        // 1900 --> <-- 1997 (erreur max : 0.9 secondes)
        return this.polynomial([-2.44, + 87.24, +815.20, -2637.80, -18756.33,
        +124906.15, -303191.19, 372919.88,
        -232424.66, 58353.42], t);
      };
    
  }

  static polynomial(parameters, value, firstpass = true) {
    //usage : param1 + param2 * X + param3 * X^2 + param4 * X^3...+ paramn * X^n
    // polynomial([param1, param2, param3, param4,...paramn], X)
    
    if(firstpass) parameters = parameters.reverse();

    if(parameters.length > 1) {
      //console.log("size : " + parameters.length + "param = " + parameters[parameters.length - 1] + " value = " + value);
      return parameters.pop() + value * this.polynomial(parameters, value, false); 
    }
    else if(parameters.length == 1)
            return parameters.pop();
          else return 0;
  }

  static td(year, month, day, hour, minute, second) {
    let datetime = new Date(year, month - 1, day, hour, minute, second);
    console.log(datetime);

    return new Date(year, month - 1, day, hour, minute, second + this.deltaT(year, month, day, hour, minute, second));
  }

  static ut(year, month, day, hour, minute, second) {
    let datetime = new Date(year, month - 1, day, hour, minute, second);
    console.log(datetime);

    return new Date(year, month - 1, day, hour, minute, second - this.deltaT(year, month, day, hour, minute, second));
  }
}
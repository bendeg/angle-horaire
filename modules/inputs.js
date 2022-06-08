/*
Permet l'ajout de 4 'input' type text
1 input en degrés décimaux et 3 inputs pour les degrés DMS, ou HMS

Modifier l'input en degrés décimaux modifie les 3 inputs DMS.
Modifier un des 3 input DMS modifie l'input des degrés décimaux.

2ème argument du constructeur : 'parent', est l'id de la div recevant l'input des degrés décimaux
les 3 inputs sont créés dans 3 'div' dont les ids sont 'parentd', 'parentm' et 'parents'
Ces 4 'div' doivent exister dans le document HTML pour que ça fonctionne.

3ème argument du constructeur : isDMS
true => DMS (par défaut)
false => HMS

*/

export class InputTextDMSHMS {
  element;
  elementD;
  elementM;
  elementS;
  ratioDMSHMS;

  constructor(parent, value, isDMS = true) {
    //permet aux methodes de connaître "this" !
    //https://stackoverflow.com/questions/4011793/this-is-undefined-in-javascript-class-methods
    this.changeDegre = this.changeDegre.bind(this);
    this.changeDMS = this.changeDMS.bind(this);

    isDMS ? this.ratioDMSHMS = 1 : this.ratioDMSHMS = 15;

    this.element = document.createElement('input');
    this.element.type = "text";
    this.element.value = value;
  
    this.element.oninput = this.changeDegre;
    document.getElementById(parent).appendChild(this.element);

    this.elementD = document.createElement('input');
    this.elementD.type = "text";
    this.elementD.value = "0";
    this.elementD.oninput = this.changeDMS;
    document.getElementById(parent + "d").appendChild(this.elementD);

    this.elementM = document.createElement('input');
    this.elementM.type = "text";
    this.elementM.value = "0";
    this.elementM.oninput = this.changeDMS;
    document.getElementById(parent + "m").appendChild(this.elementM);

    this.elementS = document.createElement('input');
    this.elementS.type = "text";
    this.elementS.value = "0";
    this.elementS.oninput = this.changeDMS;
    document.getElementById(parent + "s").appendChild(this.elementS);
  }

  getValue() {
    return this.element.value;
  }

  setValue(value) {
    this.element.value = value;
    this.changeDegre();
  }

  changeDegre() {
    var temp = parseFloat(this.getValue()) / this.ratioDMSHMS,
        temptrunc;

    temptrunc = Math.trunc(temp);
    this.elementD.value = temptrunc;
  
    temp = (temp - temptrunc) * 60;
    temptrunc = Math.trunc(temp);
    this.elementM.value = temptrunc;
  
    temp = (temp - temptrunc) * 60;
    this.elementS.value = temp;  
  }

  changeDMS() {
    this.setValue(this.ratioDMSHMS * (parseFloat(this.elementD.value) + parseFloat(this.elementM.value) / 60 + parseFloat(this.elementS.value) / 3600));
  }
  
}

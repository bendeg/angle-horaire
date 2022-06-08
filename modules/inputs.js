/*
Permet l'ajout de 4 'input' type text
1 'input' en degrés décimaux et 3 inputs pour les degrés DMS.
Modifier l'input en degrés décimaux modifie les 3 inputs DMS.
Modifier un des 3 input DMS modifie l'input des degrés décimaux.

'parent' est l'id de la 'div' recevant l'input des degrés décimaux
les 3 inputs sont créés dans 3 'div' dont les ids sont 'parentd', 'parentm' et 'parents'
Ces 4 'div' doivent exister dans le document HTML pour que ça fonctionne.
*/

export class InputTextDMS {
  element;
  elementD;
  elementM;
  elementS;

  constructor(id, parent, value) {
    //permet aux methodes de connaître "this" !
    //https://stackoverflow.com/questions/4011793/this-is-undefined-in-javascript-class-methods
    this.changeDegre = this.changeDegre.bind(this);
    this.changeDMS = this.changeDMS.bind(this);

    this.element = document.createElement('input');
    this.element.id = id;
    this.element.type = "text";
    this.element.value = value;
  
    this.element.oninput = this.changeDegre;
    document.getElementById(parent).appendChild(this.element);

    this.elementD = document.createElement('input');
    this.elementD.id = id + "d";
    this.elementD.type = "text";
    this.elementD.value = "0";
    this.elementD.oninput = this.changeDMS;
    document.getElementById(parent + "d").appendChild(this.elementD);

    this.elementM = document.createElement('input');
    this.elementM.id = id + "m";
    this.elementM.type = "text";
    this.elementM.value = "0";
    this.elementM.oninput = this.changeDMS;
    document.getElementById(parent + "m").appendChild(this.elementM);

    this.elementS = document.createElement('input');
    this.elementS.id = id + "s";
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
  }

  changeDegre() {
    var temp, temptrunc;
    temptrunc = Math.trunc(parseFloat(this.getValue()));
    this.elementD.value = temptrunc;
  
    temp = (parseFloat(this.getValue()) - temptrunc) * 60;
    temptrunc = Math.trunc(temp);
    this.elementM.value = temptrunc;
  
    temp = (temp - temptrunc) * 60;
    this.elementS.value = temp;  
  }

  changeDMS() {
    this.setValue(parseFloat(this.elementD.value) + parseFloat(this.elementM.value) / 60 + parseFloat(this.elementS.value) / 3600);
  }
  
}

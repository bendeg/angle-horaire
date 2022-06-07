export class InputText {
  #element;

  constructor(id, parent, value, func) {
    this.#element = document.createElement('input');
    this.#element.id = id;
    this.#element.type = "text";
    this.#element.value = value;
    this.#element.oninput = func;
    document.getElementById(parent).appendChild(this.#element);
  }

  getValue() {
    return this.#element.value;
  }

  setValue(value) {
    this.#element.value = value;
  }
}
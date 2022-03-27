export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.append(this.#tileElement);
    this.value = value; // also calls `set value` as you are accessing it and trying to set a value.
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    // this.#tileElement.textContent = v;
    const imageURL = `url('images/${v}.gif')`;
    this.#tileElement.style.backgroundImage = imageURL;
    this.#tileElement.style.backgroundRepeat = "no-repeat";
    this.#tileElement.style.backgroundSize = "contain";

    const power = Math.log2(v); // gets how many times the `v` is raised to 2. EX: v = 4, then Math.log2(4) returns 2.
    const backgroundLightness = 100 - power * 9; // So everytime the power raises, deccrease the lightness by 9%.

    // this.#tileElement.style.setProperty(
    //   "--background-lightness",
    //   `${backgroundLightness}%`
    // );
    // this.#tileElement.style.setProperty(
    //   "--text-lightness",
    //   `${backgroundLightness <= 50 ? 90 : 10}%`
    // );
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value); // creates CSS Variable
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value); // creates CSS Variable
  }

  remove() {
    this.#tileElement.remove(); // remove from DOM.
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      );
    });
  }
}

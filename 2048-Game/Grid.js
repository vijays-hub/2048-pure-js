const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
  #cells; // Private. So can be accessed only within this class.
  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", `${GRID_SIZE}`); // creates CSS Variable
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

    this.#cells = createCellElement(gridElement).map(
      (cellElement, index) =>
        new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
    );
  }

  get cells() {
    return this.#cells;
  }

  get cellsByColumn() {
    /*
     * Making Array of Arrays. (Ex: For 4 GRID_SIZE -> (4) [Array(4), Array(4), Array(4), Array(4)]). Each Array is the column.
     * And each index will have -> 0: (4) [Cell, Cell, Cell, Cell].
     * Check Logs for better persepctive.
     */
    const cellsByColumn = this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || []; // row
      cellGrid[cell.x][cell.y] = cell; // column
      return cellGrid;
    }, []);
    return cellsByColumn;
  }

  get cellsByRow() {
    const cellsByRow = this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || []; // row
      cellGrid[cell.y][cell.x] = cell; // column
      return cellGrid;
    }, []);
    return cellsByRow;
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value) // this makes sure that we merge only one tile at a time.
    );
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    const newValue = this.tile.value + this.mergeTile.value;

    // End the Game if any tile reaches 2048.
    if (newValue == 2048) {
      document.getElementById("game-board").style.backgroundImage =
        "url('/images/2048.gif')";
      document.getElementById("game-board").style.backgroundRepeat =
        "no-repeat";
      document.getElementById("game-board").style.backgroundSize = "cover";

      const allCells = document.getElementsByClassName("cell");
      const allTiles = document.getElementsByClassName("tile");
      removeClassesFromDOM(allCells);
      removeClassesFromDOM(allTiles);
      return true;
    }

    this.tile.value = newValue;
    this.mergeTile.remove(); // present in Tile Class.
    this.mergeTile = null;
  }
}

function removeClassesFromDOM(classList) {
  for (let index = 0; index < classList.length; index++) {
    classList[index].style.display = "none";
  }
}

function createCellElement(gridElement) {
  // EX: GRID-SIZE = 4 -> Returns 16 `<div class="cell"></div>` and adds it inside `<div id="game-board"></div>`
  const cells = Array(GRID_SIZE * GRID_SIZE)
    .fill("")
    .map((item) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      gridElement.append(cell);
      return cell;
    });
  return cells;
}

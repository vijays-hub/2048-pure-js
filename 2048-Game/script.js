import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);

// Get 2 random cells at render.
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupUserInput();

function setupUserInput() {
  /* 
  `* Only Once, because we need to wait for the tiles to settle before new tile pop in.
   * Instance: Let's say user press down arrow key, we need to wait untill all the existing tiles to settle down, beofre we show new tile card. 
    */
  window.addEventListener("keydown", handleUserInput, { once: true });
}

async function handleUserInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupUserInput();
        return;
      }
      await moveUp(); // Awaitng the movement + animation to happen before we merge after the switch (i.e., `cell.mergeTiles()`).
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupUserInput();
        return;
      }
      await moveRight();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupUserInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupUserInput();
        return;
      }
      await moveLeft();
      break;
    default: // since user haven't pressed any of the (up, down, right, left) key, we can wait for another user input.
      setupUserInput();
      return;
  }

  //   Code that runs only if we click arrow keys. If we press any other key, `default` case will be executed and it returns out of the fun.
  let finish = false;
  grid.cells.forEach((cell) => {
    finish = cell.mergeTiles();
  });

  if (finish) return;

  //   Add a new Tile.
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  //   Handle Loose states.
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      gameBoard.style.backgroundImage = "url('images/game-over.gif')";
      gameBoard.style.backgroundRepeat = "no-repeat";
      gameBoard.style.backgroundSize = "cover";

      // Get all Cells & Tiles and hide them.
      const allCells = document.getElementsByClassName("cell");
      const allTiles = document.getElementsByClassName("tile");
      removeClassesFromDOM(allCells);
      removeClassesFromDOM(allTiles);
    });
    return;
  }

  //  Setup user input again after the event is done for the next input.
  setupUserInput();
}

function removeClassesFromDOM(classList) {
  for (let index = 0; index < classList.length; index++) {
    classList[index].style.display = "none";
  }
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse())); // Simply reversing the columns orders.
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse())); // Simply reversing the columns orders.
}

function slideTiles(cells) {
  return Promise.all(
    // For MoveUp/MoveDown -> the group will be column.
    // For MoveLeft/MoveRight -> the group will be row.
    cells.flatMap((group) => {
      const promises = [];

      // Loop through the column / row.
      // Staring with index = 1, because the first element can't move up/left/down/right respectively.
      for (let index = 1; index < group.length; index++) {
        const cell = group[index];
        if (cell.tile == null) continue; // If the cell tile is null, don't do anything else. Just contnue to next cell iteration.

        //   When tile is not null...
        let lastValidCell = null;
        //   Loop through all the remaining tiles in this column/row. And then check all the other tiles above / besides to see if we can move the tile (upward, downward or sideways).
        //   Ex: For moveUp : To get the cell above the cell we are currently at, j = index - 1. ex: If we have index=1, then j = (index-1) = 0, which is the element above index = 1.
        for (let j = index - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break; // if we can't move up to the above cell, no poinbt in checking for further tiles above that cell. so simply break.
          lastValidCell = moveToCell;
        }

        if (lastValidCell !== null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            //   Merge to the existing valid tile.
            lastValidCell.mergeTile = cell.tile;
          } else {
            // set the tile.
            lastValidCell.tile = cell.tile;
          }

          cell.tile = null; // rset the tile in the current cell, we no longer need it.
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}
function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}
function canMoveLeft() {
  return canMove(grid.cellsByRow);
}
function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index == 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

// Misc.
// Get the modal
var modal = document.getElementById("myModal");
modal.style.transition = "all 2s"

// Get the element that opens the modal
var btn = document.getElementById("modalTriggerBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the element, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

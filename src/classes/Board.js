const Tile = require('./Tile');
const Ship = require('./Ship');
const { validPosition, validAngle } = require('../helpers/positionHelpers');
const { VALID_ANGLES } = require('../constants/GLOBAL');

class Board {
  constructor({
    owner = 'AI'
  }={}) {
    this.owner = owner;
    this.rows = 10;
    this.columns = 10;
    this.maxPosition = [this.columns - 1, this.rows - 1];
    this.ships = [];
    this.tiles = this.initTiles(this.rows, this.columns);
  }

  initTiles(rows, columns) {
    if (!Number.isInteger(rows)
        || !Number.isInteger(columns)
        || rows < 1
        || columns < 1
        || rows > 15
        || columns > 15) {
      throw new Error(`Board.initTiles called with invalid argument(s) [rows, columns]: [${rows}, ${columns}]`)
    }
    const result = []
    for(let i = 0; i < rows; i++) {
      const row = [];
      for(let j = 0; j < columns; j++) {
        row.push(new Tile());
      }
      result.push(row);
    }
    return result;
  }

  addShip(ship, position, angle) {
    if (!(ship instanceof Ship)) {
      throw new Error(`Board.addShip called with invalid ship argument: ${ship}`);
    }
    if (!validPosition(position)) {
      throw new Error(`Board.addShip called with invalid position argument: ${position}`);
    }
    if (!this.positionIsInsideBoard(position)) {
      throw new Error(`Board.addShip tried to add a ship outside the board bounds: 
        position: ${position}
        rows: ${this.rows}
        columns: ${this.columns}`);
    }
    if (!validAngle(angle)) {
      throw new Error(`Board.addShip called with invalid angle argument: ${angle}`);
    }
    // Input validation passed, add the ship to the board!
    this.ships.push({ ship, position, angle });
  }

  positionIsInsideBoard(position) {
    if (!validPosition(position)) {
      throw new Error(`positionIsInsideBoard() called with invalid argument: ${position}`)
    }

    const x = position[0];
    const y = position[1];
    return (
      x >= 0 &&
      y >= 0 &&
      x <= this.maxPosition[0] &&
      y <= this.maxPosition[1]
    );
  }

  getAllNeighbors(position) {
    return VALID_ANGLES.map(angle => this.getNeighbor(position, angle))
  }

  getNeighbor(position, angle) {
    if (!validPosition(position)) {
      throw new Error(`Board.getNeighbor called with invalid position argument: ${position}`);
    }
    if (!validAngle(angle)) {
      throw new Error(`Board.getNeighbor called with invalid angle argument: ${angle}`);
    }
    if (!this.positionIsInsideBoard(position)) {
      throw new Error(`Board.getNeighbor called with position outside board:
        position: ${position}
        maxPosition: ${this.maxPosition}`);
    }
    const x = position[0];
    const y = position[1];
    let neighborPosition;

    if (x % 2 === 1) {
      // Case where x is odd
      switch (angle) {
        case 0:
          neighborPosition = [x, y - 1];
          break;
        case 60:
          neighborPosition = [x + 1, y];
          break;
        case 120:
          neighborPosition = [x + 1, y + 1];
          break;
        case 180:
          neighborPosition = [x, y + 1];
          break;
        case 240:
          neighborPosition = [x - 1, y + 1];
          break;
        case 300:
          neighborPosition = [x - 1, y];
          break;
      }
    } else if (x % 2 === 0) {
      // Case where x is even
      switch (angle) {
        case 0:
          neighborPosition = [x, y - 1];
          break;
        case 60:
          neighborPosition = [x + 1, y - 1];
          break;
        case 120:
          neighborPosition = [x + 1, y];
          break;
        case 180:
          neighborPosition = [x, y + 1];
          break;
        case 240:
          neighborPosition = [x - 1, y];
          break;
        case 300:
          neighborPosition = [x - 1, y - 1];
          break;
      }
    }

    return this.positionIsInsideBoard(neighborPosition) ? neighborPosition : null;
  }
}

module.exports = Board;
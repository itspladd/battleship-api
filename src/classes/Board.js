const Tile = require('./Tile');
const Ship = require('./Ship');
const { validPosition } = require('../helpers/positionHelpers')

class Board {
  constructor({
    owner = 'AI'
  }={}) {
    this.owner = owner;
    this.rows = 10;
    this.columns = 10;
    this.ships = [];
    this.validAngles = [0, 60, 120, 180, 240, 300];
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
    if (!this.validAngle(angle)) {
      throw new Error(`Board.addShip called with invalid angle argument: ${angle}`);
    }
    // Input validation passed, add the ship to the board!
    this.ships.push({ ship, position, angle });
  }

  positionIsInsideBoard(position) {
    if (!validPosition(position)) {
      throw new Error(`Board.positionIsInsideBoard() called with invalid argument: ${position}`)
    }

    const x = position[0];
    const y = position[1];
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.columns &&
      y < this.rows
    );
  }

  validAngle(angle) {
    return this.validAngles.includes(angle);
  }
}

module.exports = Board;
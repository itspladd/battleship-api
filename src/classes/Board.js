const Tile = require('./Tile');
const Ship = require('./Ship');

class Board {
  constructor({
    owner = 'AI'
  }={}) {
    this.owner = owner;
    this.rows = 10;
    this.columns = 10;
    this.ships = [];

    this.tiles = this.initTiles(this.rows, this.columns);
  }

  initTiles(rows, columns) {
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
    if (!Array.isArray(position)
        || position.length !== 2
        || position[0] > this.rows - 1
        || position[0] < 0
        || position[1] > this.columns - 1
        || position[1] < 0) {
      throw new Error(`Board.addShip called with invalid position argument: ${position}`);
    }
    this.ships.push(ship);
  }
}

module.exports = Board;
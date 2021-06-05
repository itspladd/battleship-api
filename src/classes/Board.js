const Tile = require("./Tile");

class Board {
  constructor({
    owner = 'AI'
  }={}) {
    this.owner = owner;
    this.rows = 10;
    this.columns = 10;

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
}

module.exports = Board;
const { TILE_TYPES } = require('../constants/TILES')

class Tile {
  constructor() {
    console.log('Tile constructed')
    this.type = TILE_TYPES.EMPTY;
  };
}

module.exports = Tile;
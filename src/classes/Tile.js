const { TILE_TYPES } = require('../constants/TILES')

class Tile {
  constructor({ type = TILE_TYPES.EMPTY }={}) {
    this.type = type;
  };
}

module.exports = Tile;
const { TILE_TYPES } = require('../constants/TILES')

class Tile {
  constructor({ type = TILE_TYPES.EMPTY }={}) {
    this.typeStack = [type]
  }

  addType(newType) {
    this.typeStack.push(newType);
  }
}

module.exports = Tile;
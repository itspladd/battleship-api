const { TILE_TYPES } = require('../constants/TILES')

class Tile {
  constructor({ type = TILE_TYPES.EMPTY }={}) {
    this.typeStack = [type]
  }

  set type(newType) {
    this.typeStack.push(newType);
  }

  get type() {
    return this.typeStack[this.typeStack.length - 1];
  }
}

module.exports = Tile;
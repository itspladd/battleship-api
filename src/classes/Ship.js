const { SHIP_TYPES } = require('../constants/SHIPS')

class Ship {
  constructor() {
    this.segments = SHIP_TYPES.DEFAULT.SEGMENTS
  }
  
}

module.exports = Ship;
const { SHIP_TYPES } = require('../constants/SHIPS');
const { getNeighborsInDirection } = require('../helpers/positionHelpers');

class Ship {
  constructor() {
    this.segments = SHIP_TYPES.DEFAULT.SEGMENTS
    this.positions = null;
  }

  setOwner(board) {
    this.owner = board;
  }
}

module.exports = Ship;
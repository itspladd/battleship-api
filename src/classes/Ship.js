const { SHIP_TYPES } = require('../constants/SHIPS');
const { getNeighborsInDirection, validAngle } = require('../helpers/positionHelpers');

class Ship {
  constructor() {
    this.segments = SHIP_TYPES.DEFAULT.SEGMENTS
    this.positions = null;
  }

  setOwner(board) {
    if(!(board instanceof Object)) {
      throw new Error(`Ship.setOwner called with invalid board argument: ${board}`)
    }
    this.owner = board;
    return this.owner;
  }

  setPositions(position, angle) {
  }
}

module.exports = Ship;
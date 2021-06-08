const { SHIP_TYPES } = require('../constants/SHIPS');
const { getNeighborsInDirection,
        validAngle,
        validatePositionAndAngle } = require('../helpers/positionHelpers');
const { handleError } = require('../helpers/errorHelpers')

class Ship {
  constructor() {
    this.segments = [ ...SHIP_TYPES.DEFAULT.SEGMENTS ];
    this._position = null;
    this.angle = 0;
  }

  setOwner(board) {
    if(!(board instanceof Object)) {
      throw new Error(`Ship.setOwner called with invalid board argument: ${board}`)
    }
    this.owner = board;
    return this.owner;
  }

  /**
   * Set the location of this ship. Note that this does NOT
   * necessarily mean the location is valid; this is just where
   * the ship exists right now. The Board should handle whether
   * or not you can actually PLACE the ship in this location.
   */
  setPositions(position, angle) {
    try {
      validatePositionAndAngle(position, angle);
    } catch (err) {
      handleError(err);
      return false;
    }
    this.position = position;
    this.angle = angle;

    const shipLength = this.segments.length;
    const positions = getNeighborsInDirection(position, angle, shipLength)
    // Map the positions into the segments array.
    this.segments = this.segments.map((segment, index) => {
      const newSeg = {
        ...segment,
        position: positions[index]
      };
      return newSeg;
    });

    return this.segments;
  }

  // Does this ship collide with a given position?
  collidesWith(positions) {
    // Filtering function returns true if the position matches any segment positions
    const filterFunc = position => {
      for (const segment of this.segments) {
        const [segX, segY] = segment.position;
        const [x, y] = position;
        if (segX === x && segY === y) {
          return true;
        }
      }
      return false; // No matches, return false
    }
    const result = positions.filter(filterFunc)
    // Return the collision locations if they exist, or false if no collisions
    return result.length > 0 ? result : false;
  }

  collidesWithShip(ship) {
    return this.collidesWith(ship.segments.map(seg => seg.position))
  }

  get position() {
    return [...this._position];
  }

  set position(newVal) {
    if(Array.isArray(newVal)) {
      this._position = [...newVal];
    } else {
      this._position = newVal;
    }
  }
}

module.exports = Ship;
const { SHIP_TYPES } = require('../constants/SHIPS');
const { getNeighborsInDirection,
        validAngle,
        validPosition,
        validatePositionAndAngle } = require('../helpers/positionHelpers');
const { handleError,
        argErrorMsg } = require('../helpers/errorHelpers')

class Ship {
  constructor(type) {
    this.typeName = type ? type.NAME : SHIP_TYPES.DEFAULT.NAME;
    this.segments = this.initSegments(this.typeName);
    this._position = null;
    this.angle = 0;
  }

  // Spread each segment from the constants into a new object.
  initSegments(type) {
    console.log(type)
    return SHIP_TYPES[type].SEGMENTS
          .map(SEGMENT => ({ ...SEGMENT }))
  }

  segmentAt(position) {
    if (!validPosition(position)) {
      throw new Error(argErrorMsg(position, "position", this.segmentAt))
    }
    const filterFunc = (segment) => {
      const [segX, segY] = segment.position;
      const [x, y] = position;
      if (segX === x && segY === y) {
        return true;
      }
    }
    const results = this.segments.filter(filterFunc)

    if (results.length > 1) {
      throw new Error('Ship.segmentAt found multiple segments with the same position');
    } else if (results.length === 1) {
      return results[0];
    } else if (results.length < 1) {
      return false;
    }
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

    const shipLength = this.length;
    const positions = getNeighborsInDirection(position, angle, shipLength)
    // Map the positions into the segments array.
    // Each segment now looks like { position: [x, y], hp: Int }
    this.segments = this.segments.map((segment, index) => {
      const newSeg = {
        ...segment,
        position: positions[index]
      };
      return newSeg;
    });

    return this.segments;
  }

  get totalHP() {
    const reducer = (total, segment) => total + segment.hp;
    return this.segments.reduce(reducer, 0);
  }

  set totalHP(value) {
    if (!Number.isInteger(value)) {
      throw new Error(argErrorMsg(value, "value", { name: "totalHP" }));
    }
    // If the value is 0, just set it all to 0.
    if (value === 0) {
      this.segments = this.segments.map(seg => ({ ...seg, hp: 0}));
    } else {
      //Otherwise, recursively call this function to set segments to 0,
      //then distribute HP along the rest of the segments
      this.totalHP = 0;
      for(let i = 0; i < value; i++) {
        const segIndex = i % this.length;
        console.log(segIndex)
        this.segments[segIndex].hp += 1;
      }
    }
  }

  get length() {
    return this.segments.length;
  }

  get destroyed() {
    return this.totalHP > 0;
  }

  // Does this ship collide with a given position?
  collidesWith(positions) {
    // Filtering function returns true if the position matches any segment positions
    const result = positions.filter(position => this.segmentAt(position))
    // Return the collision locations if they exist, or false if no collisions
    return result.length > 0 ? result : false;
  }

  collidesWithShip(ship) {
    const collisions = this.collidesWith(ship.segments.map(seg => seg.position));

    return collisions ? { ship, collisions } : false;
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

  // Reduce the HP of the segments at the input positions by the input value.
  // Assumes that collision checking has already been done,
  // and that all positions are valid.
  damageSegments(positions, value = 1) {
    if(!Array.isArray(positions[0])) {
      positions = [positions]
    }

    positions.forEach(position => {
      this.segmentAt(position).hp -= value;
    })
  }

  destroy() {
    this.owner.ships = this.owner.ships.filter(ship => ship !== this)
  }
}

module.exports = Ship;
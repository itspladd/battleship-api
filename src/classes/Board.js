const Tile = require('./Tile');
const Ship = require('./Ship');
const { validPosition, validatePositionAndAngle } = require('../helpers/positionHelpers');
const { handleError, argErrorMsg } = require('../helpers/errorHelpers');
const { VALID_ANGLES } = require('../constants/GLOBAL');
const { SHIP_TYPES } = require('../constants/SHIPS');
const RULES = require('../constants/RULES');

class Board {
  constructor({
    owner = 'none',
    ships = RULES.DEFAULT_RULES.SHIP_LIST
  }={}) {
    this.owner = owner;
    this.rows = 10;
    this.columns = 10;
    this.maxPosition = [this.columns - 1, this.rows - 1];
    this.ships = this.initShips(ships);
    this.placedShips = {};
    this.tiles = this.initTiles(this.rows, this.columns);
  }

  get owner() {
    return this._owner
  }

  set owner(owner) {
    this._owner = owner
  }

  get ships() {
    return this._ships
  }

  get shipsArr() {
    return Object.values(this._ships)
  }

  set ships(ships) {
    this._ships = ships
  }

  get shipTypes() {
    return this.shipsArr.map(ship => ship.type)
  }

  get placedShipsArr() {
    return Object.values(this.placedShips)
  }

  get shipsStillAlive() {
    return this.shipsArr.filter(ship => !ship.destroyed)
  }

  initTiles(rows, columns) {
    if (!Number.isInteger(rows)
        || !Number.isInteger(columns)
        || rows < 1
        || columns < 1
        || rows > 15
        || columns > 15) {
      throw new Error(`Board.initTiles called with invalid argument(s) [rows, columns]: [${rows}, ${columns}]`)
    }
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

  initShips(list) {
    const results = {}
    let id = 0;
    for (const type of list) {
      const newShip = new Ship(SHIP_TYPES[type], this, id);
      results[newShip.id] = newShip;
      id++;
    }

    return results;
  }

  // Validate a Ship's location on the board, and then add it
  // to the placedShips array
  placeShip(ship) {
    if (!this.ships[ship.id]) {
      return {
        valid: false,
        msg: `Can't place a ship owned by another board!
        This board owned by: ${this.owner.name}
        Ship is on board owned by: ${ship.owner.owner.name}`
      }
    }
    if (!this.validShipLocation(ship)) {
      return {
        valid: false,
        msg: `Can't place a ship at position ${ship.position} with angle ${ship.angle}`
      };
    }

    this.placedShips[ship.id] = ship;
    return { valid: true, msg: 'Ship placed successfully' };
  }

  validShipLocation(ship) {
    return (
      this.entireShipInsideBoard(ship) &&
      this.noShipCollisions(ship)
    )
  }

  positionIsInsideBoard(position) {
    try {
      if (!validPosition(position)) {
        throw new Error(`positionIsInsideBoard() called with invalid argument: ${position}`)
      }
    } catch (err) {
      handleError(err);
      return false;
    }

    const x = position[0];
    const y = position[1];
    return (
      x >= 0 &&
      y >= 0 &&
      x <= this.maxPosition[0] &&
      y <= this.maxPosition[1]
    );
  }

  entireShipInsideBoard(ship) {
    for (const segment of ship.segments) {
      if(!this.positionIsInsideBoard(segment.position)) {
        return false;
      }
    }

    return true;
  }

  noShipCollisions(shipUnderTest) {
    const results = this.placedShipsArr
                    .filter(ship => shipUnderTest.collidesWithShip(ship))
    return results.length === 0;
  }

  // Return the Ship at the target position if there is one.
  shipAt(position) {
    const results = this.shipsArr
                    .filter(ship => ship.segmentAt(position));
    return results[0] ? results[0] : false;
  }

  // Return the tile at the target position if there is one.
  // Since the tiles are created as an array of rows,
  // then we need to flip the coordinates to get the expected tile.
  tileAt(position) {
    const [x, y] = position;
    return this.tiles[y] && this.tiles[y][x] ? this.tiles[y][x] : false;
  }
}

module.exports = Board;
const { SHIP_TYPES } = require('./SHIPS');
const { TILE_TYPES } = require('./TILES')
const GLOBAL = require('./GLOBAL');

const { GAME_STATES, TARGETING } = GLOBAL;
const { STATE_EQUALS } = GLOBAL.STATE_VALIDATORS;
const { FIND_BAD_KEYS } = GLOBAL.DATA_VALIDATORS;

const DEFAULT_RULES = {
  SHIP_LIST: [
    SHIP_TYPES.DESTROYER.NAME,
    SHIP_TYPES.SUBMARINE.NAME,
    SHIP_TYPES.CRUISER.NAME,
    SHIP_TYPES.BATTLESHIP.NAME,
    SHIP_TYPES.AIRCRAFT_CARRIER.NAME
  ],
  MOVES: {
    MOVE_SHIP: {
      NAME: "MOVE_SHIP",
      INVALID_DATA: (move) => {
        const requiredKeys = [
          "moveType",
          "playerID",
          "targetPlayerID",
          "shipID",
          "position",
          "angle"
        ]
        return FIND_BAD_KEYS(move, requiredKeys)
      },
      VALID_STATE: (state) => STATE_EQUALS(state, GAME_STATES.PLACE_SHIPS),
      VALID_TARGET: TARGETING.SELF,
      VALID_OTHER: (engine, move) => {
        return engine.getPlayerShip(move.playerID, move.shipID)
      },
      PROCESS: (engine, move) => {
        const ship = engine.getPlayerShip(move.playerID, move.shipID);
        return ship ? ship.setPositions(move.position, move.angle) : false;
      }
    },
    PLACE_SHIP: {
      NAME: "PLACE_SHIP",
      INVALID_DATA: (move) => {
        const requiredKeys = [
          "moveType",
          "playerID",
          "targetPlayerID",
          "shipID"
        ];
        return FIND_BAD_KEYS(move, requiredKeys)
      },
      VALID_STATE: (state) => STATE_EQUALS(state, GAME_STATES.PLACE_SHIPS),
      VALID_TARGET: TARGETING.SELF,
      VALID_OTHER: (engine, move) => {
        const ship = engine.getPlayerShip(move.playerID, move.shipID);
        const board = engine.players[move.playerID].board;
        return ship && board.validShipLocation(ship)
      },
      PROCESS: (engine, move) => {
        const ship = engine.getPlayerShip(move.playerID, move.shipID);
        const board = engine.players[move.playerID].board;
        board.placeShip(ship);
      }
    },
    FIRE: {
      NAME: "FIRE",
      INVALID_DATA: (move) => {
        const requiredKeys = [
          "moveType",
          "playerID",
          "targetPlayerID",
          "position"
        ];
        return FIND_BAD_KEYS(move, requiredKeys)
      },
      VALID_STATE: (state) => STATE_EQUALS(state, GAME_STATES.TAKE_TURNS),
      VALID_TARGET: TARGETING.OPPONENT,
      VALID_OTHER: (engine, move) => {
        const target = engine.players[playerID].board.tileAt(move.position);
        return !(target.typeStack.includes(TILE_TYPES.HIT) ||
                 target.typeStack.includes(TILE_TYPES.MISS))
      }
    }
  }
}

module.exports = {
  DEFAULT_RULES
}
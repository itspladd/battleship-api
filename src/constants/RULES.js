const { SHIP_TYPES } = require('./SHIPS');
const { GAME_STATES, TARGETING } = require('./GLOBAL');

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
      REQUIRES: ["moveType", "playerID", "targetPlayerID", "shipID", "position", "angle"],
      VALID_STATE: [GAME_STATES.PLACE_SHIPS],
      VALID_TARGET: TARGETING.SELF
    },
    PLACE_SHIP: {
      NAME: "PLACE_SHIP",
      REQUIRES: ["moveType", "playerID", "targetPlayerID", "shipID"],
      VALID_STATE: [GAME_STATES.PLACE_SHIPS],
      VALID_TARGET: TARGETING.SELF
    },
    FIRE: {
      NAME: "FIRE",
      REQUIRES: ["moveType", "playerID", "targetPlayerID", "position"],
      VALID_STATE: [GAME_STATES.TAKE_TURNS],
      VALID_TARGET: TARGETING.OTHER
    }
  }
}

module.exports = {
  DEFAULT_RULES
}
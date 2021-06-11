const VALID_ANGLES = [0, 60, 120, 180, 240, 300]

const GAME_STATES = {
  INTIALIZING: "INITIALIZING", // Game is setting itself up.
  PLACE_SHIPS: "PLACE_SHIPS", // Game allows players to place ships.
  FREE_MOVES: "FREE_MOVES", // Game allows any move at any time.
  TAKE_TURNS: "TAKE_TURNS", // Game enforces turn-based moves.
  GAME_OVER: "GAME_OVER"
}

const MOVE_TYPES = {
  MOVE_SHIP: {
    NAME: "MOVE_SHIP",
    REQUIRES: ["moveType", "playerID", "targetPlayerID", "shipID", "position", "angle"]
  },
  PLACE_SHIP: {
    NAME: "PLACE_SHIP",
    REQUIRES: ["moveType", "playerID", "targetPlayerID", "shipID"]
  },
  FIRE: {
    NAME: "FIRE",
    REQUIRES: ["moveType", "playerID", "targetPlayerID", "position"]
  }
}

module.exports = {
  VALID_ANGLES,
  GAME_STATES,
  MOVE_TYPES
}
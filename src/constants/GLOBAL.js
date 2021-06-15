const VALID_ANGLES = [0, 60, 120, 180, 240, 300]

// Used to validate the target of a move.
// Give the targeting function two player IDs to see if they meet reqs
const TARGETING = {
  SELF: (A, B) => A === B,
  OPPONENT: (A, B) => A !== B,
  ANY: (A, B) => A || B
}

// Given an object and an array of key strings, return
// an array of all discrepancies between the object's keys
// and the input keys.
const DATA_VALIDATORS = {
  FIND_BAD_KEYS: (move, requiredKeys) => {
    const moveKeys = Object.keys(move);
    const missingKeys = requiredKeys.filter(key => !moveKeys.includes(key));
    const extraKeys = moveKeys.filter(key => !requiredKeys.includes(key))
    if (missingKeys.length) {
      return missingKeys;
    }
    if (extraKeys.length) {
      return extraKeys;
    }
    return [];
  }
}


const STATE_VALIDATORS = {
  STATE_EQUALS: (A, B) => A === B,
  STATE_INCLUDED_IN: (A, B) => B.includes(A),
  STATE_NOT_INCLUDED_IN: (A, B) => !(B.includes(A))
}

const BOARD_VALIDATORS = {
  SHIP_EXISTS_FOR_PLAYER: (shipID, playerID, engine) => {
    return engine.players[playerID].board.ships[shipID] ? true : false;
  },
  TILE_NOT_FIRED_AT: (board, position) => {
    const tile = board.tileAt(position)
  }
}

const GAME_STATES = {
  INTIALIZING: "INITIALIZING", // Game is setting itself up.
  PLACE_SHIPS: "PLACE_SHIPS", // Game allows players to place ships.
  TAKE_TURNS: "TAKE_TURNS", // Game enforces turn-based moves.
  GAME_OVER: "GAME_OVER",
  PAUSED: "PAUSED" // Game will not process moves
}


module.exports = {
  VALID_ANGLES,
  GAME_STATES,
  TARGETING,
  STATE_VALIDATORS,
  BOARD_VALIDATORS,
  DATA_VALIDATORS
}
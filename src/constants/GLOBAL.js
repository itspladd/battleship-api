const VALID_ANGLES = [0, 60, 120, 180, 240, 300]

// Used to validate the target of a move.
// Give the targeting function two player IDs to see if they meet reqs
const TARGETING = {
  SELF: (A, B) => A === B,
  OTHER: (A, B) => A !== B,
  ANY: (A, B) => true
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
  TARGETING
}
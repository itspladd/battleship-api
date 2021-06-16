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
  WINNER: (engine) => {
    // When one player is left, return that player's ID.
    // Otherwise, return false.
    const playersRemaining = engine.playersWithIntactShips()
    return playersRemaining.length === 1 && playersRemaining[0]
  },
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
        return board.placeShip(ship);
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
        // It must be the attacking player's turn.
        const isPlayersTurn = engine.nextPlayer.id === move.playerID;
        // Target tile must exist
        const targetTile = engine.players[move.targetPlayerID].board.tileAt(move.position);
        // Tile must not have been fired upon already.
        // ('targetTile &&' on the following line is just to check that the tile exists)
        const tilePreviouslyTargeted = targetTile &&
          (targetTile.typeStack.includes(TILE_TYPES.HIT) ||
          targetTile.typeStack.includes(TILE_TYPES.MISS));
        return isPlayersTurn && targetTile && !tilePreviouslyTargeted;
      },
      PROCESS: (engine, move) => {
        try {
          const board = engine.players[move.targetPlayerID].board;
          const targetTile = board.tileAt(move.position)
          const targetShip = board.shipAt(move.position);
          if (targetShip) {
            targetShip.damageSegmentsAt(move.position);
            targetTile.typeStack = TILE_TYPES.HIT
          } else {
            targetTile.typeStack = TILE_TYPES.MISS
          }
          engine.advancePlayers();
        } catch (err) {
          return false;
        }
        return true;
      }
    }
  }
}

module.exports = {
  DEFAULT_RULES
}
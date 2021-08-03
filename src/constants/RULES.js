const { SHIP_TYPES } = require('./SHIPS');
const { TILE_TYPES } = require('./TILES')
const { GAME_STATES, TARGETING, MOVE_KEYS, STATE_VALIDATORS, DATA_VALIDATORS } = require('./GLOBAL');

const { STATE_EQUALS } = STATE_VALIDATORS;
const { FIND_BAD_KEYS } = DATA_VALIDATORS;

const DEFAULT_RULES = {
  SHIP_LIST: [
    SHIP_TYPES.DESTROYER.NAME,
    SHIP_TYPES.SUBMARINE.NAME,
    SHIP_TYPES.CRUISER.NAME,
    SHIP_TYPES.BATTLESHIP.NAME,
    SHIP_TYPES.AIRCRAFT_CARRIER.NAME
  ],
  WINNER: (engine) => {
    // When one player is left, return that Player object.
    // Otherwise, return false.
    const playersRemaining = engine.playersWithIntactShips()
    return playersRemaining.length === 1 && playersRemaining[0]
  },
  MOVES: {
    START_GAME: {
      NAME: "START_GAME",
      INVALID_DATA: (move) => {
        const requiredKeys = [MOVE_KEYS.TYPE];
        return FIND_BAD_KEYS(move, requiredKeys);
      },
      VALID_STATE: (state) => STATE_EQUALS(state, GAME_STATES.PLACE_SHIPS),
      VALID_OTHER: (engine) => {
        // Valid only if all players have placed all their ships
        for (const playerID in engine.players) {
          if (!engine.players[playerID].board.allShipsPlaced) {
            return false;
          }
        };
        return true;
      },
      PROCESS: (engine) => {
        engine.state = GAME_STATES.TAKE_TURNS;
        return true;
      }
    },
    MOVE_SHIP: {
      NAME: "MOVE_SHIP",
      INVALID_DATA: (move) => {
        const requiredKeys = [
          MOVE_KEYS.TYPE,
          MOVE_KEYS.PLAYER_ID,
          MOVE_KEYS.TARGET_PLAYER_ID,
          MOVE_KEYS.SHIP_ID,
          MOVE_KEYS.POSITION,
          MOVE_KEYS.ANGLE
        ]
        return FIND_BAD_KEYS(move, requiredKeys)
      },
      VALID_STATE: (state) => STATE_EQUALS(state, GAME_STATES.PLACE_SHIPS),
      VALID_TARGET: TARGETING.SELF,
      VALID_OTHER: (engine, move) => {
      return engine.getPlayerShip(move[MOVE_KEYS.PLAYER_ID], move[MOVE_KEYS.SHIP_ID])
      },
      PROCESS: (engine, move) => {
        const ship = engine.getPlayerShip(move[MOVE_KEYS.PLAYER_ID], move[MOVE_KEYS.SHIP_ID]);
        return ship ? ship.setPositions(move[MOVE_KEYS.POSITION], move[MOVE_KEYS.ANGLE]) : false;
      }
    },
    PLACE_SHIP: {
      NAME: "PLACE_SHIP",
      INVALID_DATA: (move) => {
        const requiredKeys = [
          MOVE_KEYS.TYPE,
          MOVE_KEYS.PLAYER_ID,
          MOVE_KEYS.TARGET_PLAYER_ID,
          MOVE_KEYS.SHIP_ID,
        ];
        return FIND_BAD_KEYS(move, requiredKeys)
      },
      VALID_STATE: (state) => STATE_EQUALS(state, GAME_STATES.PLACE_SHIPS),
      VALID_TARGET: TARGETING.SELF,
      VALID_OTHER: (engine, move) => {
        const ship = engine.getPlayerShip(move[MOVE_KEYS.PLAYER_ID], move[MOVE_KEYS.SHIP_ID]);
        const board = engine.players[move[MOVE_KEYS.PLAYER_ID]].board;
        return ship && board.validShipLocation(ship)
      },
      PROCESS: (engine, move) => {
        const ship = engine.getPlayerShip(move[MOVE_KEYS.PLAYER_ID], move[MOVE_KEYS.SHIP_ID]);
        const board = engine.players[move[MOVE_KEYS.PLAYER_ID]].board;
        return board.placeShip(ship);
      }
    },
    UNPLACE_SHIP: {
      NAME: "UNPLACE_SHIP",
      INVALID_DATA: (move) => {
        const requiredKeys = [
          MOVE_KEYS.TYPE,
          MOVE_KEYS.PLAYER_ID,
          MOVE_KEYS.TARGET_PLAYER_ID,
          MOVE_KEYS.SHIP_ID,
        ];
        return FIND_BAD_KEYS(move, requiredKeys)
      },
      VALID_STATE: (state) => STATE_EQUALS(state, GAME_STATES.PLACE_SHIPS),
      VALID_TARGET: TARGETING.SELF,
      VALID_OTHER: (engine, move) => {
        // Ship must exist and already be placed.
        const ship = engine.getPlayerShip(move[MOVE_KEYS.PLAYER_ID], move[MOVE_KEYS.SHIP_ID]);
        const board = engine.players[move[MOVE_KEYS.PLAYER_ID]].board;
        return ship && board.placedShips[ship.id] === ship;
      },
      PROCESS: (engine, move) => {
        const board = engine.players[move[MOVE_KEYS.PLAYER_ID]].board;
        delete board.placedShips[move[MOVE_KEYS.SHIP_ID]]
      }
    },
    FIRE: {
      NAME: "FIRE",
      INVALID_DATA: (move) => {
        const requiredKeys = [
          MOVE_KEYS.TYPE,
          MOVE_KEYS.PLAYER_ID,
          MOVE_KEYS.TARGET_PLAYER_ID,
          MOVE_KEYS.POSITION
        ];
        return FIND_BAD_KEYS(move, requiredKeys)
      },
      VALID_STATE: (state) => STATE_EQUALS(state, GAME_STATES.TAKE_TURNS),
      VALID_TARGET: TARGETING.OPPONENT,
      VALID_OTHER: (engine, move) => {
        // It must be the attacking player's turn.
        const isPlayersTurn = engine.nextPlayer.id === move[MOVE_KEYS.PLAYER_ID];
        // Target tile must exist
        const targetTile = engine.players[move[MOVE_KEYS.TARGET_PLAYER_ID]].board.tileAt(move[MOVE_KEYS.POSITION]);
        // Tile must not have been fired upon already.
        // ('targetTile &&' on the following line is just to check that the tile exists)
        const tilePreviouslyTargeted = targetTile &&
          (targetTile.typeStack.includes(TILE_TYPES.HIT) ||
          targetTile.typeStack.includes(TILE_TYPES.MISS));
        return isPlayersTurn && targetTile && !tilePreviouslyTargeted;
      },
      PROCESS: (engine, move) => {
        try {
          const board = engine.players[move[MOVE_KEYS.TARGET_PLAYER_ID]].board;
          const targetTile = board.tileAt(move[MOVE_KEYS.POSITION])
          const targetShip = board.shipAt(move[MOVE_KEYS.POSITION]);
          if (targetShip) {
            targetShip.damageSegmentsAt(move[MOVE_KEYS.POSITION]);
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
const clone = require('just-clone');

const Board = require('../classes/Board')

const { GAME_STATES } = require('../constants/GLOBAL');
const RULES = require('../constants/RULES')
const { argErrorMsg, handleError } = require('../helpers/errorHelpers');
const {
  shuffleArray,
  noDuplicateUnderscoresRecursive,
  stripUnderscoresRecursive
} = require('../helpers/generalHelpers')
const Player = require('./Player');

class GameEngine {
  constructor({
    players,
    aiPlayers, // Number of AI players
    rules
  } = {}) {
    this.rules = rules;
    this._stateStack = [GAME_STATES.INITIALIZING]
    this._players = this.initPlayers(players);
    this._playerOrder = shuffleArray(Object.keys(this._players))
    this._moveStack = [];
    this._moveHistory = [];
    this.state = GAME_STATES.PLACE_SHIPS
  }

  get nextPlayer() {
    return this._players[this._playerOrder[0]];
  }

  get players() {
    return this._players;
  }

  set players(players) {
    this._players = { ...players };
  }

  // Return the most recent state in the stack
  get state() {
    return this._stateStack[this._stateStack.length - 1]
  }

  // Add a new current state to the stack if it's not the same as the current state
  set state(newState) {
    newState !== this.state && this._stateStack.push(newState);
  }

  get lastMove() {
    return this._moveHistory[this._moveHistory.length -1];
  }

  get rules() {
    return this._rules;
  }

  set rules(rulesIn) {
    const rulesObj = rulesIn ? RULES[rulesIn] : RULES.DEFAULT_RULES;
    this._rules = clone(rulesObj);
  }

  // Return a JSON-friendly version of the current game state
  get gameState() {
    // The owner properties cause circular references.
    // This is fine in the game operation, but bad for JSON!
    // If we have a circular reference to an owner, replace it with the owner's ID.
    const replacer = (key, val) => {
      return key === '_owner' ? val.id : val;
    }
    // Stringify then parse to make sure we've broken all references to original objects
    const parsed = JSON.parse(JSON.stringify(this, replacer))
    // Remove underscores from property names
    noDuplicateUnderscoresRecursive(parsed);
    stripUnderscoresRecursive(parsed);
    return parsed;
  }

  advancePlayers() {
    this._playerOrder.push(this._playerOrder.shift())
  }

  declareWinner(player) {
    this.winnerID = player.id;
    this.state = GAME_STATES.GAME_OVER;
  }

  playersWithIntactShips() {
    const players = Object.values(this.players)
    return players.filter(player => player.board.shipsStillAlive.length > 0)

  }

  validPlayerData(player) {
    return  player.name &&
            player.id &&
            typeof player.name === 'string'
  }

  inputMove(move) {
    const moveResolutionPromise = new Promise ((resolve, reject) => {
      let moveResults = this.validateMove(move);
      if (moveResults.valid) {
        moveResults = { ...moveResults, ...(this.processMove(move)) }
        moveResults.processed && this._moveHistory.push(move);
      } else {
        moveResults = {
          ...moveResults,
          processed: false,
          error: `Validation failed. Move not processed`
        }
      }
      const winner = this.rules.WINNER(this);
      winner && this.declareWinner(winner)
      // moveResults now contains { valid, processed, error, validationMsg }
      // add gameState to moveResults and resolve.
      moveResults.gameState = this.gameState;
      resolve(moveResults);
    })
    return moveResolutionPromise;
  }

  validateMove(move) {
    let result;
    try {
      // General move validation
      result = this.validateGeneralMoveData(move)
      if (!result.valid) {
        throw new Error(result.validationMsg);
      }
      return result;
    } catch (err) {
      handleError(err);
      return result;
    }
  }

  validateGeneralMoveData(move) {
    const MOVES = this.rules.MOVES;
    // All moves are false until checked!
    let valid = false;
    let validationMsg = `Board.validateMove: `;

    // Check that we got an Object for the move
    if (!(move instanceof Object)) {
      validationMsg += `invalid move argument: ${typeof move}, should be an object`;
      return { valid, validationMsg }
    }
    // Check that it matches a MOVE_TYPE in GLOBAL.js
    if (!this.rules.MOVES[move.moveType]) {
      validationMsg += `invalid move type: ${move.moveType}`;
      return { valid, validationMsg };
    }

    const MOVE_RULES = this.rules.MOVES[move.moveType]

    // Check that it includes the necessary keys for that move
    const invalidKeys = MOVE_RULES.INVALID_DATA(move)
    if(invalidKeys.length > 0) {
      validationMsg += `${move.moveType} called with missing/extra data.
      move data: ${move}
      bad keys: ${invalidKeys}`
    }

    // Now check that we're in a valid state
    if (MOVE_RULES.VALID_STATE && !MOVE_RULES.VALID_STATE(this.state)) {
      validationMsg += `${move.moveType} not valid during ${this.state} state.
      Current state: ${this.state}`
      return { valid, validationMsg };
    }

    // Check that the target of the move is valid
    if (MOVE_RULES.VALID_TARGET && !MOVE_RULES.VALID_TARGET(move.playerID, move.targetPlayerID)) {
      validationMsg += `Invalid target for ${move.moveType}. Valid target type is ${MOVE_RULES.VALID_TARGET.name}.
      playerID: ${move.playerID},
      targetPlayerID: ${move.targetPlayerID}`
      return { valid, validationMsg };
    }

    // If there's other validation functions for this move and they return false,
    // report back.
    if (MOVE_RULES.VALID_OTHER && !MOVE_RULES.VALID_OTHER(this, move)) {
      validationMsg += `Additional validation failed for ${move.moveType}.`
      return { valid, validationMsg };
    }

    return { valid: true, validationMsg: 'Move successfully validated' };
  }

  processMove(move) {
    const MOVE_RULES = this.rules.MOVES[move.moveType]
    const processed = MOVE_RULES.PROCESS(this, move);
    return { processed }
  }

  initPlayers(players) {
    // If called with no players array
    if (!players) {
      return this.makeDefaultPlayers();
    }
    try {

      const validPlayers = players.filter(this.validPlayerData)
      const uniqueIDs = new Set(players.map(player => player.id))
      // If array has bad data
      if (!Array.isArray(players) ||
          validPlayers.length !== players.length
      ) {
        throw new Error(argErrorMsg(players, "players", this.initPlayers))
      }
      // If we were provided duplicate player IDs
      if (uniqueIDs.size !== players.length) {
        throw new Error(`Duplicate player ids found`);
      }
    } catch (err) {
      handleError(err);
      return false;
    }
    const results = {};
    players.forEach(playerData => {
      results[playerData.id] = new Player(playerData)
    });
    return results;
  }

  makeDefaultPlayers() {
    const p1 = new Player({id: "p1", name: 'DEFAULT-PLAYER-1' })
    const p2 = new Player({id: "p2", name: 'DEFAULT-PLAYER-2' })
    return { p1, p2 }
  }

  getPlayerShip(playerID, shipID) {
    return  playerID &&
            shipID &&
            this.players[playerID] &&
            this.players[playerID].board.ships[shipID]
  }
}

module.exports = GameEngine;
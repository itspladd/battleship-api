const { json } = require('express');
const Board = require('../classes/Board')

const { GAME_STATES, MOVE_TYPES } = require('../constants/GLOBAL');
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
    } = {}) {

    this._stateStack = [GAME_STATES.INTIALIZING]
    this._players = this.initPlayers(players);
    this._playerOrder = shuffleArray(Object.keys(this._players))
    this._moveStack = [];
    this._moveHistory = [];
  }

  get nextPlayer() {
    return this._players(this.playerOrder[0]);
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

  // Add a new current state to the stack
  set state(newState) {
    this._stateStack.push(newState);
  }

  get lastMove() {
    return this._moveHistory[this._moveHistory.length -1];
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
    noDuplicateUnderscoresRecursive(parsed);
    stripUnderscoresRecursive(parsed);
    return parsed;
  }

  advancePlayers() {
    this._playerOrder.push(this._playerOrder.shift())
  }

  validPlayerData(player) {
    return  player.name &&
            player.id &&
            typeof player.name === 'string'
  }

  inputMove(move) {
    const moveResolutionPromise = new Promise ((resolve, reject) => {
      const { valid, msg } = this.validateMove(move);
      if (valid) {
        const { processed, error, gameState } = this.processMove(move);
      } else {
        const processed = false;
        const error = `Validation failed. Move not processed`;
        const gameState = this.gameState;
      }
      resolve({ valid, processed, error, msg, gameState });
    })
  }

  validateMove(move) {
    const validation = {
      ANY_MOVE: this.validateGeneralMoveData,
      MOVE_SHIP: this.validateMoveShipMove,
      PLACE_SHIP: this.validatePlaceShipMove,
      FIRE: this.validateFireMove
    }
    let result;
    try {
      // General move validation
      result = validation.ANY_MOVE(move)
      if (!result.valid) {
        throw new Error(result.msg);
      }
      // Validation specific to move type
      result = validation[move.moveType](move);
      if (!result.valid) {
        throw new Error(result.msg);
      }
      return result;
    } catch (err) {
      handleError(err);
      return result;
    }
  }

  validateGeneralMoveData(move) {
    // All moves are false until checked!
    let valid = false;
    let msg = `Board.validateMove: `;

    // Check that we got an Object for the move
    if (!(move instanceof Object)) {
      msg += `invalid move argument: ${typeof move}, should be an object`;
      return { valid, msg }
    }
    // Check that it matches a MOVE_TYPE in GLOBAL.js
    if (!MOVE_TYPES[move.moveType]) {
      msg += `invalid move type: ${move.moveType}`;
      return { valid, msg };
    }

    // Check that it includes the keys in MOVE_TYPE.REQUIRES
    const moveKeys = Object.keys(move);
    const neededKeys = MOVE_TYPES[move.moveType].REQUIRES;
    const missingKeys = neededKeys.filter(key => !moveKeys.includes(key));
    const extraKeys = moveKeys.filter(key => !neededKeys.includes(key))
    if (missingKeys.length) {
      msg += `missing move data for move ${move.moveType}: ${missingKeys.join(' ')}`
      return { valid, msg };
    }

    // And check that we didn't accidentally include extra data
    if (extraKeys.length) {
      msg += `extra move data for move ${move.moveType}: ${extraKeys.join(' ')}`
      return { valid, msg };
    }

    return { valid: true, msg: 'Move successfully validated' };
  }

  validateMoveShipMove(move) {
    // Set up convenience variables
    let valid = false
    let msg = `Board.validateMoveShipMove: `
    const { playerID, targetPlayerID, shipID } = move;
    const targetBoard = this.players[playerID].board

    // Players can only move their own ships, so the IDs should match.
    if (playerID !== targetPlayerID) {
      msg += `Tried to move another player's ship. PlayerID must match targetPlayerID:
      playerID: ${playerID},
      targetPlayerID: ${targetPlayerID}`
      return { valid, msg };
    }

    // Ship must exist.
    if (!targetBoard.ships[shipID]) {
      msg += `Tried to move nonexistent ship.
      shipID: ${shipID}`
      return { valid, msg };
    }

    // Players can't move a placed ship unless they're in PLACE_SHIPS phase
    if(
      this.state !== GAME_STATES.PLACE_SHIPS &&
      targetBoard.placedShips[shipID]
    ) {
      msg += `Can't move placed ships outside of ${GAME_STATES.PLACE_SHIPS} state.
      Current state: ${this.state},
      shipID: ${shipID}
      playerID: ${playerID}`
      return { valid, msg };
    }

    return { valid: true, msg: 'Move successfully validated'}
  }

  validatePlaceShipMove(move) {

  }

  validateFireMove(move) {

  }

  processMove(move) {
    const moveType = move.moveType;
    const processor = {
      MOVE_SHIP: this.processMoveShipMove.bind(this),
      PLACE_SHIP: this.processPlaceShipMove,
      FIRE: this.processFireMove
    }
    const { processed, error } = processor[moveType](move);
    const gameState = this.gameState;
    return { processed, error, gameState }
  }

  processMoveShipMove(move) {
    const { playerID, shipID, position, angle } = move;
    const ship = this.players[playerID].board.ships[shipID];
    try {
      if (ship.setPositions(position, angle)) {
        return {
          processed: true,
          error: null
        }
      } else {
        return {
          processed: false,
          error: `Could not process move: ${move}. No error thrown.`
        }
      }
    } catch (err) {
      return {
        processed: false,
        error: err.message
      }
    }
  }

  processPlaceShipMove(move) {

  }

  processFireMove(move) {

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
}

module.exports = GameEngine;
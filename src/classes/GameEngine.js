const Board = require('../classes/Board')

const { GAME_STATES, MOVE_TYPES } = require('../constants/GLOBAL');
const { argErrorMsg, handleError } = require('../helpers/errorHelpers');
const { shuffleArray } = require('../helpers/generalHelpers')
const Player = require('./Player');

class GameEngine {
  constructor({
    players,
    aiPlayers, // Number of AI players
    } = {}) {
    console.log('constructed')

    this._stateStack = [GAME_STATES.INTIALIZING]
    this._players = this.initPlayers(players);
    this._playerOrder = shuffleArray(Object.keys(this._players))
    this._moveStack = []
  }

  get nextPlayer() {
    return this_players[0];
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

  get nextMove() {
    return this._moveStack[0];
  }

  advancePlayers() {
    this._playerOrder.push(this._playerOrder.shift())
  }

  validPlayerData(player) {
    return  player.name &&
            player.id &&
            typeof player.name === 'string'
  }

  validateMove(move) {
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
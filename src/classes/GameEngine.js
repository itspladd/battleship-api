const Board = require('../classes/Board')

const { GAME_STATES, MOVE_TYPES } = require('../constants/GLOBAL');
const { argErrorMsg, handleError } = require('../helpers/errorHelpers');
const Player = require('./Player');

class GameEngine {
  constructor({
    players,
    aiPlayers = [], // Number of players
    } = {}) {
    console.log('constructed')

    this.numPlayers = players;
    this.boards = this.initBoards(players, aiPlayers);
  }

  mockPlayers() {
    return [
      new Player(0, 'Trapezius')
    ]
  }

  initBoards(players, aiPlayers) {
    try {
      if (!Array.isArray(players)) {
        throw new Error(argErrorMsg(players, "players", this.intiBoards));
      }
    } catch (err) {
      handleError(err);
      return false;
    }
    const results = {}
    for(const player of players) {
      results[i] = new Board(i);
    }

    for(let i = 0; i < aiPlayers; i++) {
      results.push(new Board(`ai${i}`));
    }

    return results;
  }
}

module.exports = GameEngine;
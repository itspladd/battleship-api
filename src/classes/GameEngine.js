const { GAME_STATES, MOVE_TYPES } = require('../constants/GLOBAL');

class GameEngine {
  constructor({
    players // Number of players
    } = {}) {
    console.log('constructed')

    this.players = players;
  }
}

module.exports = GameEngine;
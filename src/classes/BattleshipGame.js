const { GAME_STATES, MOVE_TYPES } = require('../constants/GLOBAL');

class BattleshipGame {
  constructor({
    players // Number of players
    } = {}) {
    console.log('constructed')

    this.players = players;
  }
}

module.exports = BattleshipGame;
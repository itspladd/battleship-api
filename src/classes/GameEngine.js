class GameEngine {
  constructor({
    players // Array of all players
    } = {}) {
    console.log('constructed')
    this.players = players;
  }
}

module.exports = GameEngine;
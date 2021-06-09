class GameEngine {
  constructor({
      players, //array of all players
    } = {}) {
    console.log('constructed')
    this.players = players;
  }
}

module.exports = GameEngine;
class GameEngine {
  constructor({
      players
    }) {
    console.log('constructed')
    this.players = players;
  }
}

module.exports = GameEngine;
const { GAME_STATES, MOVE_TYPES } = require('../constants/GLOBAL');
const Board = require('../classes/Board')

class GameEngine {
  constructor({
    players = 2 // Number of players
    } = {}) {
    console.log('constructed')

    this.numPlayers = players;
    this.boards = this.initBoards(players);
  }

  initBoards(num) {
    const results = []
    for(let i = 0; i < num; i++) {
      results.push(new Board(i));
    }

    return results;
  }
}

module.exports = GameEngine;
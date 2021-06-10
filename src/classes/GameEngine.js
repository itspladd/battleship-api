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

    this.players = this.initPlayers(players)
    this.boards = this.initBoards(players, aiPlayers);
  }

  validPlayerData(player) {
    return  player.name &&
            player.id &&
            typeof player.name === 'string'
  }

  initPlayers(players) {
    try {
      // If called with no players array
      if (!players) {
        const p1 = new Player({id: "p1", name: 'DEFAULT-PLAYER-1' })
        const p2 = new Player({id: "p2", name: 'DEFAULT-PLAYER-2' })
        return { p1, p2 }
      }
      const invalidPlayers = players.filter(this.validPlayerData)
      const uniqueIDs = new Set(players.map(player => player.id))
      // If array has bad data
      if (!Array.isArray(players) ||
          invalidPlayers.length > 0
      ) {
        throw new Error(argErrorMsg(players, "players", this.initPlayers))
      }
      // If we were provided duplicate player IDs
      if (uniqueIDs.length !== players.length) {
        throw new Error(`Duplicate player ids found`)
      }
    } catch (err) {
      console.log(err)
      handleError(err);
      return false;
    }
    const results = {};
    players.forEach(playerData => {
      results[player.id] = new Player(playerData)
    });
    return results
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
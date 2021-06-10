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

    this._players = this.initPlayers(players);
    this._playerOrder = shuffleArray(Object.keys(this._players))
  }

  get nextPlayer() {
    return this_players[0];
  }

  advancePlayers() {
    this._playerOrder.push(this._playerOrder.shift())
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
}

module.exports = GameEngine;
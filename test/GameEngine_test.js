const should = require('chai').should()
const BattleshipGame = require('../src/classes/BattleshipGame')

describe('BattleshipGame', () => {
  describe('BattleshipGame(), constructed with no parameters', () => {
    let testEngine;
    const testPlayers = ['Trapezius', 'Tautrion'];
    before(() => {
      testEngine = new BattleshipGame({
          players: [...testPlayers]
        }
      );
    });
    it('should create an instance of a game engine', () => {
      should.exist(testEngine)
    });
    it('should contain an array of the players', () => {
      should.exist(testEngine.players)
      testEngine.players.should.deep.equal(testPlayers)
    });
  })
})
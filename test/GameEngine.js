const should = require('chai').should()
const GameEngine = require('../src/classes/GameEngine')

describe('GameEngine', () => {
  describe('GameEngine()', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine({
          players: ["Trapezius", "Tautrion"]
        }
      );
    });
    it('should create an instance of a game engine', () => {
      should.exist(testEngine)
    });
    it('should contain an array of the players', () => {
      should.exist(testEngine.players)
      testEngine.players.should.deep.equal(["Trapezius", "Tautrion"])
    });
    it('should contain an array of the moves taken');
  })
})
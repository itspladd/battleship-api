const should = require('chai').should()
const GameEngine = require('../src/classes/GameEngine')
const Board = require('../src/classes/Board')

describe('GameEngine', () => {
  describe('GameEngine(), constructed with no parameters', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should create an instance of a game engine', () => {
      should.exist(testEngine);
    });
    it('should contain two Players by default', () => {
      should.exist(testEngine.players)
    });
  })

  describe('validPlayerData(player)', () => {
    let testEngine;
      before(() => {
        testEngine = new GameEngine();
      });
    it('should return true if the input data has a string name and id', () => {
      testEngine.validPlayerData({ name: "Dave", id: "1X3" }).should.be.true;
      testEngine.validPlayerData({ name: "Rose", id: 8 }).should.be.true;
    })
  })

  describe('initPlayers(players)', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should return an array of default players if given no arguments', () => {
      testEngine.initPlayers()["p1"].name.should.equal('DEFAULT-PLAYER-1')
    })
    it('should return false if given bad player data', () => {
      const badPlayers = [{ name: "Dave", id: 4 }, { name: ["bad"], id: 3 }]
      const dupeIDPlayers = [{ name: "Dave", id: 4 }, { name: "John", id: 4 }]
      testEngine.initPlayers('a').should.be.false;
      testEngine.initPlayers(badPlayers).should.be.false;
      testEngine.initPlayers(dupeIDPlayers).should.be.false;
    })
    it('should return an object of Player objects with the correct properties when given proper inputs', () => {
      const goodPlayers = [{ name: "Dave", id: "1X3" }, { name: "Rose", id: 8 }]
      const results = testEngine.initPlayers(goodPlayers)
      console.log(results)
      results["1X3"].name.should.equal("Dave");
      results[8].name.should.equal("Rose");
    })
  })
})
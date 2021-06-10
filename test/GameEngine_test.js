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
    it('should contain a Board for each player (default 2)', () => {
      should.exist(testEngine.boards);
      testEngine.boards.length.should.equal(2);
      testEngine.boards[0].should.be.an.instanceof(Board);
    });
  })

  describe('initPlayers(players)', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should return an array of default players if given no arguments', () => {
      testEngine.initPlayers()[0].name.should.equal('DEFAULT-PLAYER-1')
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
      testEngine.initPlayers(goodPlayers)
      testEngine.goodPlayers["1X3"].name.should.equal("Dave");
      testEngine.goodPlayers[8].name.should.equal("Rose");
    })
  })

  describe('initBoards()', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should require an array input for players', () => {
      const bad1 = testEngine.initBoards("player1");
    })
  })
})
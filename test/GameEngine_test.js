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
})
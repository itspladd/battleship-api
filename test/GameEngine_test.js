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
      should.exist(testEngine._players)
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
      results["1X3"].name.should.equal("Dave");
      results[8].name.should.equal("Rose");
    })
  })

  describe('advancePlayers()', () => {
    it('should return the players cycled by 1, so that the current player is now the last', () => {
      const players = [{ name: "1", id: 1}, { name: "2", id: 2}, { name: "3", id: 3}];
      const testEngine = new GameEngine({ players });
      const prevOrder = [...testEngine._playerOrder];
      testEngine.advancePlayers();
      testEngine._playerOrder[0].should.equal(prevOrder[1]);
      testEngine._playerOrder[1].should.equal(prevOrder[2]);
      testEngine._playerOrder[2].should.equal(prevOrder[0]);
    })
  })

  describe('validateMove()', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should return an object with a false bool and message if the move is not in the MOVE_TYPES constant', () => {
      const result = testEngine.validateMove({ moveType: 'WIN_GAME' })
      result.valid.should.be.false;
      result.msg.should.match(/invalid move type: WIN_GAME/i);
    });
    it('should return an object with a false bool and message if the move does not have the keys in the MOVE_TYPES[TYPE].REQUIRES constant', () => {
      const move = { moveType: 'PLACE_SHIP', targetPlayerID: '4'}
      const result = testEngine.validateMove(move)
      result.valid.should.be.false;
      result.msg.should.match(/missing move data/i)
      result.msg.should.match(/shipType/i)
      result.msg.should.match(/playerID/i)
    })
    it('should return an object with a false bool and message if the move has keys not found in the MOVE_TYPES[TYPE].REQUIRES constant', () => {
      const move = { moveType: 'PLACE_SHIP', playerID: '4', targetPlayerID: '4' }
      const result = testEngine.validateMove(move)
      result.valid.should.be.false;
      result.msg.should.match(/missing move data/i)
      result.msg.should.match(/shipType/i)
      result.msg.should.match(/playerID/i)
    })
  })

  describe('addValidatedMove()', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should add the input move to the moveStack', () => {

    })
  })
})
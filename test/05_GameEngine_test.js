const should = require('chai').should()
const GameEngine = require('../src/classes/GameEngine')
const Board = require('../src/classes/Board')
const Ship = require('../src/classes/Ship')

const { noDuplicateUnderscoresRecursive } = require('../src/helpers/generalHelpers')

const { GAME_STATES, MOVE_KEYS } = require('../src/constants/GLOBAL')
const { MOVES } = require('../src/constants/RULES').DEFAULT_RULES

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

  describe('validateGeneralMoveData()', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should return an object with a false bool and message if the move is not in the MOVES constant', () => {
      const result = testEngine.validateGeneralMoveData({ [MOVE_KEYS.TYPE]: 'WIN_GAME' })
      result.valid.should.be.false;
      result.validationMsg.should.match(/invalid move type: WIN_GAME/i);
    });
    it('should return an object with a false bool and message if the move does not have the keys in the MOVES[TYPE].REQUIRES constant', () => {
      const move = { [MOVE_KEYS.TYPE]: MOVES.PLACE_SHIP.NAME, targetPlayerID: 'p2'}
      const result = testEngine.validateGeneralMoveData(move)
      result.valid.should.be.false;
      result.validationMsg.should.match(/called with missing\/extra data/i)
      result.validationMsg.should.match(/shipID/i)
      result.validationMsg.should.match(/playerID/i)
    })
    it('should return an object with a false bool and message if the move has keys not found in the MOVES[TYPE].REQUIRES constant', () => {
      const move = { [MOVE_KEYS.TYPE]: MOVES.PLACE_SHIP.NAME, playerID: 'p1', targetPlayerID: 'p1', shipID: 2, damage: 5 }
      const result = testEngine.validateGeneralMoveData(move)
      result.valid.should.be.false;
      result.validationMsg.should.match(/called with missing\/extra data/i)
      result.validationMsg.should.match(/damage/i)
    })
  });

  describe('inputMove()', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
      goodMove = {
        [MOVE_KEYS.TYPE]: MOVES.MOVE_SHIP.NAME,
        playerID: 'p1',
        targetPlayerID: 'p1',
        shipID: testEngine.players.p1.board.shipsArr[0].id,
        position: [0, 0],
        angle: 180,
      };
    });
    it('should return false with an error message if the move is invalid');
    it('should return true with a null error if the move is valid');
    it('should add valid moves to the move history');
  })

  describe('gameState()', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should not throw an error due to circular references', () => {
      const test = () => testEngine.gameState;
      test.should.not.throw(Error)
    })
    it('should not contain any keys with leading underscores', () => {
      const parsedState = testEngine.gameState;
      noDuplicateUnderscoresRecursive(parsedState).should.be.true;
    })
    it('should contain a parseable version of the game state with all data intact', () => {
      const parsedState = testEngine.gameState;
      const parsedCarrier = parsedState.players.p1.board.ships.ship4.typeStr
      const engineCarrier = testEngine._players.p1._board.ships.ship4.type;
      parsedCarrier.should.equal(engineCarrier);
    })
  })
})
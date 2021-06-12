const should = require('chai').should()
const GameEngine = require('../src/classes/GameEngine')
const Board = require('../src/classes/Board')
const Ship = require('../src/classes/Ship')

const { MOVE_TYPES, GAME_STATES } = require('../src/constants/GLOBAL')

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
    it('should return an object with a false bool and message if the move is not in the MOVE_TYPES constant', () => {
      const result = testEngine.validateGeneralMoveData({ moveType: 'WIN_GAME' })
      result.valid.should.be.false;
      result.msg.should.match(/invalid move type: WIN_GAME/i);
    });
    it('should return an object with a false bool and message if the move does not have the keys in the MOVE_TYPES[TYPE].REQUIRES constant', () => {
      const move = { moveType: MOVE_TYPES.PLACE_SHIP.NAME, targetPlayerID: '4'}
      const result = testEngine.validateGeneralMoveData(move)
      result.valid.should.be.false;
      result.msg.should.match(/missing move data for move PLACE_SHIP/i)
      result.msg.should.match(/shipID/i)
      result.msg.should.match(/playerID/i)
    })
    it('should return an object with a false bool and message if the move has keys not found in the MOVE_TYPES[TYPE].REQUIRES constant', () => {
      const move = { moveType: MOVE_TYPES.PLACE_SHIP.NAME, playerID: '4', targetPlayerID: '4', shipID: 2, damage: 5 }
      const result = testEngine.validateGeneralMoveData(move)
      result.valid.should.be.false;
      result.msg.should.match(/extra move data for move PLACE_SHIP/i)
      result.msg.should.match(/damage/i)
    })
  });

  describe('validateMoveShipMove()', () => {
    let goodMove
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
      goodMove = {
        moveShipType: MOVE_TYPES.MOVE_SHIP.NAME,
        playerID: 'p1',
        targetPlayerID: 'p1',
        shipID: testEngine.players.p1.board.shipsArr[0].id,
        position: [0, 0],
        angle: 180,
      };
    });
    it('should not allow movement of a nonexistent ship', () => {
      const badMove = {
        ...goodMove,
        shipID: 'bananana'
      }
      testEngine.validateMoveShipMove(badMove).valid.should.be.false;
    });
    it('should not allow movement of another Player\'s ship', () => {
      const badMove = {
        ...goodMove,
        targetPlayerID: 'p2'
      }
      testEngine.validateMoveShipMove(badMove).valid.should.be.false;
      badMove.targetPlayerID = 'p1';
      testEngine.validateMoveShipMove(badMove).valid.should.be.true;

    });
    it('should not allow the repositioning of an already placed ship unless the game state allows', () => {
      const board = Object.values(testEngine.players)[0].board;

      testEngine.state = GAME_STATES.TAKE_TURNS;
      board.ships.ship0.setPositions([0, 0], 180);
      board.placeShip(board.ships.ship0)
      testEngine.validateMoveShipMove(goodMove).valid.should.be.false;
      testEngine.state = GAME_STATES.PLACE_SHIPS;
      testEngine.validateMoveShipMove(goodMove).valid.should.be.true;
    })
  })

  describe('inputMove()', () => {
    let testEngine;
    before(() => {
      testEngine = new GameEngine();
    });
    it('should return false with an error message if the move is invalid');
    it('should return true with a success message if the move is valid');
    it('should add valid moves to the moveStack');
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
    it('should not contain any keys duplicated with underscore versions', () => {
      const parsedState = JSON.parse(testEngine.gameState);

      noDuplicateUnderscoresRecursive(parsedState).should.be.true;
    })
    it('should contain a parseable version of the game state with all data intact', () => {
      const parsedState = JSON.parse(testEngine.gameState);
      const parsedCarrier = parsedState._players.p1._board._ships.ship4.typeStr
      const engineCarrier = testEngine._players.p1._board.ships.ship4.type;
      parsedCarrier.should.equal(engineCarrier);
    })
  })
})
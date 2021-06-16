const should = require('chai').should()
const GameEngine = require('../src/classes/GameEngine')

const { noDuplicateUnderscoresRecursive } = require('../src/helpers/generalHelpers')

const { GAME_STATES } = require('../src/constants/GLOBAL')
const { MOVES } = require('../src/constants/RULES').DEFAULT_RULES
const { TILE_TYPES } = require('../src/constants/TILES')

describe('DEFAULT_RULES', () => {
  describe('MOVE_SHIP move', () => {
    describe('Validation: ', () => {
      let goodMove
      let testEngine;
      before(() => {
        testEngine = new GameEngine();
        testEngine.state = GAME_STATES.PLACE_SHIPS
        goodMove = {
          moveType: MOVES.MOVE_SHIP.NAME,
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
        testEngine.validateGeneralMoveData(badMove).valid.should.be.false;
      });
      it('should not allow movement of another Player\'s ship', () => {
        const badMove = {
          ...goodMove,
          targetPlayerID: 'p2'
        }
        testEngine.validateGeneralMoveData(badMove).valid.should.be.false;
        badMove.targetPlayerID = 'p1';
        testEngine.validateGeneralMoveData(badMove).valid.should.be.true;
      });
      it('should not allow the repositioning of an already placed ship unless the game state allows', () => {
        const board = Object.values(testEngine.players)[0].board;

        testEngine.state = GAME_STATES.TAKE_TURNS;
        board.ships.ship0.setPositions([0, 0], 180);
        board.placeShip(board.ships.ship0)
        testEngine.validateGeneralMoveData(goodMove).valid.should.be.false;
        testEngine.state = GAME_STATES.PLACE_SHIPS;
        testEngine.validateGeneralMoveData(goodMove).valid.should.be.true;
      })
    })
    describe('Processing', () => {
      let testEngine;
      let goodMove;
      let shipID;
      before(() => {
        testEngine = new GameEngine();
        shipID = testEngine.players.p1.board.shipsArr[0].id;
        goodMove = {
          moveType: MOVES.MOVE_SHIP.NAME,
          playerID: 'p1',
          targetPlayerID: 'p1',
          shipID,
          position: [0, 0],
          angle: 180,
        };
      });
      it('should return an object: { processed: bool, gameState: Object }', () => {
        const { processed, gameState } = testEngine.processMove(goodMove);
        processed.should.be.a('boolean')
        should.exist(gameState)
      });
      it('should return true and an updated gameState if the move succeeds with no error', () => {
        const { processed, error, gameState } = testEngine.processMove(goodMove);
        processed.should.be.true;
        gameState.players.p1.board.ships[shipID].segments.should.deep.equal(
          [
            { hp: 1, position: [0, 0]},
            { hp: 1, position: [0, 1]}
          ]);
      })
      it('should return false and the original gameState if the move fails', () => {
        badMove = { ...goodMove, shipID: 'notThere' }
        prevGameState = testEngine.gameState;
        const { processed, gameState } = testEngine.processMove(badMove);
        processed.should.be.false;
        gameState.should.deep.equal(prevGameState);
      })
    })
  })

  describe('PLACE_SHIP move', () =>{
    describe('Validation', () => {
      let move, ship, testEngine;
      before(() => {
        testEngine = new GameEngine();
        ship = testEngine.players.p1.board.shipsArr[0];
        ship.setPositions([0, 0], 180);
        move = {
          moveType: MOVES.PLACE_SHIP.NAME,
          playerID: 'p1',
          targetPlayerID: 'p1',
          shipID: ship.id
        };
      });
      it('should not allow placement of a ship outside the PLACE_SHIPS state', () => {
        testEngine.state = GAME_STATES.TAKE_TURNS;
        testEngine.validateGeneralMoveData(move).valid.should.be.false;
        testEngine.state = GAME_STATES.PLACE_SHIPS;
        testEngine.validateGeneralMoveData(move).valid.should.be.true;
      })
      it('should not allow placement of another player\'s ship', () => {
        const badMove = { ...move, playerID: 'p2' }
        testEngine.validateGeneralMoveData(badMove).valid.should.be.false;
      })
      it('should not allow placement of a ship outside the bounds of the board', () => {
        ship.setPositions([0, 0], 60); // Put a segment outside the board
        testEngine.validateGeneralMoveData(move).valid.should.be.false;
        ship.setPositions([1, 0], 0); // Another bad orientation
        testEngine.validateGeneralMoveData(move).valid.should.be.false;
        ship.setPositions([1, 0], 120); // Now we put it back in the board
        testEngine.validateGeneralMoveData(move).valid.should.be.true;
      })
      it('should not allow placement of a ship colliding with another ship', () => {
        const collidingShip = testEngine.players.p1.board.shipsArr[1];
        collidingShip.setPositions([3, 2], 300);
        ship.setPositions([3, 1], 180);
        testEngine.players.p1.board.placeShip(collidingShip);
        testEngine.validateGeneralMoveData(move).valid.should.be.false;
      })
    })
    describe('Processing', () => {
      let testEngine, move, board, ship, collidingShip;
      before(() => {
        testEngine = new GameEngine();
        board = testEngine.players.p1.board;
        ship = board.shipsArr[0];
        collidingShip = board.shipsArr[1];
        ship.setPositions([0, 0], 180);
        collidingShip.setPositions([[0, 3], 0])
        move = {
          moveType: MOVES.PLACE_SHIP.NAME,
          playerID: 'p1',
          targetPlayerID: 'p1',
          shipID: ship.id
        };
      });
      it('should add the ship to the placedShips object and return an updated gameState', () => {
        const { processed, gameState } = testEngine.processMove(move);
        gameState.players.p1.board.placedShips[ship.id].segments.should.deep.equal(ship.segments)
      }),
      it('should return false and the original gameState if the move fails', () => {
        testEngine.processMove(move);
        board.placedShips[ship.id].should.equal(ship)
      })
    })
  })

  describe('FIRE move', () => {
    describe('Validation', () => {
      let testEngine, move, board;
      before(() => {
        testEngine = new GameEngine();
        board = testEngine.players.p2.board;
        move = {
          moveType: MOVES.FIRE.NAME,
          playerID: 'p1',
          targetPlayerID: 'p2',
          position: [0, 0]
        }
      })
      it('should not allow a FIRE move on a tile that has already been fired upon', () => {
        board.tileAt([0, 0]).type = TILE_TYPES.MISS;
        board.tileAt([0, 1]).type = TILE_TYPES.HIT;
        MOVES.FIRE.VALID_OTHER(testEngine, move).should.be.false;
        MOVES.FIRE.VALID_OTHER(testEngine, { ...move, position: [0 , 1]}).should.be.false;
      });
      it('should not allow a FIRE move on a tile outside the target board', () => {

        MOVES.FIRE.VALID_OTHER(testEngine, { ...move, position: [-1 , 1]}).should.be.false;
        MOVES.FIRE.VALID_OTHER(testEngine, { ...move, position: [6 , 10]}).should.be.false;
      })
    })
    describe('Processing', () => {
      let testEngine, move, board;
      before(() => {
        testEngine = new GameEngine();
        board = testEngine.players.p2.board;
        move = {
          moveType: MOVES.FIRE.NAME,
          playerID: 'p1',
          targetPlayerID: 'p2',
          position: [0, 0]
        }
      })
    })
  })
})
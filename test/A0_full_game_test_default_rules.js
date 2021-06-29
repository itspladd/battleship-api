const should = require('chai').should()
const GameEngine = require('../src/classes/GameEngine');

const { MOVES } = require('../src/constants/RULES').DEFAULT_RULES;
const { GAME_STATES } = require('../src/constants/GLOBAL')

describe('Full game test with default rules', () => {
  it('should run and report a winner with no errors', async () => {
    const testEngine = new GameEngine();
    // Set up template moves with missing data to be filled in
    const p1MoveShip = {
      moveType: MOVES.MOVE_SHIP.NAME,
      playerID: 'p1',
      targetPlayerID: 'p1',
      shipID: null,
      position: null,
      angle: 180 // All ships pointing down for clarity
    }
    const p2MoveShip = {
      moveType: MOVES.MOVE_SHIP.NAME,
      playerID: 'p2',
      targetPlayerID: 'p2',
      shipID: null,
      position: null,
      angle: 180
    }
    const p1PlaceShip = {
      moveType: MOVES.PLACE_SHIP.NAME,
      playerID: 'p1',
      targetPlayerID: 'p1',
      shipID: null
    }
    const p2PlaceShip = {
      moveType: MOVES.PLACE_SHIP.NAME,
      playerID :'p2',
      targetPlayerID: 'p2',
      shipID: null
    }
    const p1Fire = {
      moveType: MOVES.FIRE.NAME,
      playerID: 'p1',
      targetPlayerID: 'p2',
      position: null
    }
    const p2Fire = {
      moveType: MOVES.FIRE.NAME,
      playerID: 'p2',
      targetPlayerID :'p1',
      position: null
    }
    // Set up an alternating sequence of moves for both players
    const moveList = [
      { ...p1MoveShip, shipID: 'ship0', position: [0, 0] }, // 0 (Move numbering for reference)
      { ...p1MoveShip, shipID: 'ship1', position: [1, 0] }, // 1
      { ...p1MoveShip, shipID: 'ship2', position: [2, 0] }, // 2
      { ...p1MoveShip, shipID: 'ship3', position: [3, 0] }, // 3
      { ...p1MoveShip, shipID: 'ship4', position: [4, 0] }, // 4
      { ...p2MoveShip, shipID: 'ship0', position: [0, 0] }, // 5
      { ...p2MoveShip, shipID: 'ship1', position: [1, 0] }, // 6
      { ...p2MoveShip, shipID: 'ship2', position: [2, 0] }, // 7
      { ...p2MoveShip, shipID: 'ship3', position: [3, 0] }, // 8
      { ...p2MoveShip, shipID: 'ship4', position: [3, 0] }, // 9 moves a ship into a colliding position with the previous ship
      // All ships positioned.
      { ...p1PlaceShip, shipID: 'ship0' }, // 10
      { ...p1PlaceShip, shipID: 'ship1' }, // 11
      { ...p1PlaceShip, shipID: 'ship2' }, // 12
      { ...p1PlaceShip, shipID: 'ship3' }, // 13
      { ...p1PlaceShip, shipID: 'ship4' }, // 14
      { ...p2PlaceShip, shipID: 'ship0' }, // 15
      { ...p2PlaceShip, shipID: 'ship1' }, // 16
      { ...p2PlaceShip, shipID: 'ship2' }, // 17
      { ...p2PlaceShip, shipID: 'ship3' }, // 18
      { ...p2PlaceShip, shipID: 'ship4' }, // 19 attempts to place the colliding ship4
      { ...p2MoveShip, shipID: 'ship4', position: [4, 0] }, // 20 repositions ship4
      { ...p2PlaceShip, shipID: 'ship4' }, // 21 should succeed
      // All ships placed. Start the game.
      { moveType: MOVES.START_GAME.NAME }, // 22
      { ...p1Fire, position: [0, 0] }, // 23
      { ...p1Fire, position: [0, 0] }, // 24 should return an error - not p1's turn
      { ...p2Fire, position: [0, 0] }, // 25
      { ...p1Fire, position: [0, 1] }, // 26
      { ...p2Fire, position: [0, 1] }, // 27 - both small boats gone
      { ...p1Fire, position: [1, 0] }, // 28
      { ...p2Fire, position: [1, 0] }, // 29
      { ...p1Fire, position: [1, 1] }, // 30
      { ...p2Fire, position: [1, 1] }, // 31
      { ...p1Fire, position: [1, 2] }, // 32
      { ...p2Fire, position: [1, 2] }, // 33
      { ...p1Fire, position: [2, 0] }, // 34
      { ...p2Fire, position: [2, 0] }, // 35
      { ...p1Fire, position: [2, 1] }, // 36
      { ...p2Fire, position: [2, 1] }, // 37
      { ...p1Fire, position: [2, 2] }, // 38
      { ...p2Fire, position: [2, 2] }, // 39 - both medium boats gone
      { ...p1Fire, position: [3, 0] }, // 40
      { ...p2Fire, position: [3, 0] }, // 41
      { ...p1Fire, position: [3, 1] }, // 42
      { ...p2Fire, position: [3, 1] }, // 43
      { ...p1Fire, position: [3, 2] }, // 44
      { ...p2Fire, position: [3, 2] }, // 45
      { ...p1Fire, position: [3, 3] }, // 46
      { ...p2Fire, position: [3, 3] }, // 47 - both 4-length boats gone
      { ...p1Fire, position: [4, 0] }, // 48
      { ...p2Fire, position: [4, 0] }, // 49
      { ...p1Fire, position: [4, 1] }, // 50
      { ...p2Fire, position: [4, 1] }, // 51
      { ...p1Fire, position: [4, 2] }, // 52
      { ...p2Fire, position: [4, 2] }, // 53
      { ...p1Fire, position: [4, 3] }, // 54
      { ...p2Fire, position: [4, 3] }, // 55
      { ...p1Fire, position: [4, 4] }, // 56 - game should be over, p1 wins
      { ...p2Fire, position: [4, 4] }, // 57 - move should not be accepted
    ]
    let result;
    for (let i = 0; i < moveList.length; i++) {
       result = await testEngine.inputMove(moveList[i]);
    }
    result.gameState.stateStack.should.deep.equal([
      GAME_STATES.INITIALIZING,
      GAME_STATES.PLACE_SHIPS,
      GAME_STATES.TAKE_TURNS,
      GAME_STATES.GAME_OVER,
    ])
    result.gameState.winnerID.should.equal('p1');
  })
})
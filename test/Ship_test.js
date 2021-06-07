const should = require('chai').should()
const Ship = require('../src/classes/Ship')
const Board = require('../src/classes/Board')
const { SHIP_TYPES } = require('../src/constants/SHIPS')

describe('Ship', () => {
  describe('Ship()', () => {
    let testShip;
    let testBoard;
    before(() => {
      testBoard = new Board();
      testShip = new Ship();
      testBoard.addShip(testShip)
    });
    it('should create an instance of a Ship', () => {
      should.exist(testShip);
    });
    it('should default to the DEFAULT constant for ships', () => {
      testShip.segments.should.deep.equal(SHIP_TYPES.DEFAULT.SEGMENTS);
    });
    it('should be owned by a Board', () => {
      testShip.owner.should.equal(testBoard)
    })
  })

})
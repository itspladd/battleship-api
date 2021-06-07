const should = require('chai').should()
const Ship = require('../src/classes/Ship')
const Board = require('../src/classes/Board')
const { SHIP_TYPES } = require('../src/constants/SHIPS')

describe('Ship', () => {
  describe('Ship()', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
    });
    it('should create an instance of a Ship', () => {
      should.exist(testShip);
    });
    it('should default to the DEFAULT constant for ships', () => {
      testShip.segments.should.deep.equal(SHIP_TYPES.DEFAULT.SEGMENTS);
    });
  })

  describe('setOwner()', () => {
    it('should set the owner of this Ship to the input object', () => {
      const testShip = new Ship()
      const testObj = { blah: 5 };

      testShip.setOwner(testObj);
      testShip.owner.should.equal(testObj);
    });
  })
})
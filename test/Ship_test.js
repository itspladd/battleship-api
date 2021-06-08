const should = require('chai').should()
const Ship = require('../src/classes/Ship')
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
    it('should require an input Object', () => {
      const testShip = new Ship();
      const bad = () => testShip.setOwner("hi");
      const good = () => testShip.setOwner({ key: "value" })

      bad.should.throw(Error, /invalid board argument:/i);
      good.should.not.throw(Error);
    });
    it('should set the owner of this Ship to the input object and return the same object', () => {
      const testShip = new Ship()
      const testObj = { blah: 5 };

      testShip.setOwner(testObj).should.equal(testObj);
    });
  })

  describe('setPositions()', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
    });
    it('should require a valid input position and an angle', () => {
      testShip.setPositions().should.be.false
      testShip.setPositions([0,0]).should.be.false
      testShip.setPositions([0,0], 0).should.not.be.false // Outside-board positions are fine.
    })
    it('should return the correct positions for the input value', () => {
      const result1 = testShip.setPositions([0, 0], 0);
      const result2 = testShip.setPositions([1, 1], 240);

      result1.should.deep.equal([[0, 0], [0, -1], [0, -2]]);
      result2.should.deep.equal([[1, 1], [0, 1], [-1, 0]]);
    })
  })
})
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
    it('should require an input position and an angle', () => {
      const bad1 = testShip.setPositions();
      const bad2 = testShip.setPositions([0,0]);
      const good = testShip.setPositions([0,0], 0); // Outside-board positions are fine.

      bad1.should.throw(Error);
      bad2.should.throw(Error);
    })
  })
})
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
    it('should return the correct positions for the input value within the segments array', () => {
      const result1 = testShip.setPositions([0, 0], 0)
      result1[0].position.should.deep.equal([0, 0]);
      result1[0].hp.should.equal(1);

      const result2 = testShip.setPositions([1, 1], 300)
      result2[2].position.should.deep.equal([-1, 0]);
      result2[2].hp.should.equal(1);
    })
  })

  describe('collidesWith([positions])', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
    });
    it('should return true if any of the positions in the array are the same as a ship segment', () => {
      testShip.setPositions([5, 5], 0);
      testShip.collidesWith([[5, 6], [5, 5], [4, 5], [1, 1], [5, 3]]).should.deep.equal([[5, 5], [5, 3]]);
    });
    it('should return false if none of the positions in the array are the same as a ship segment', () => {
      testShip.setPositions([5, 5], 180);
      testShip.collidesWith([[4, 5], [1, 1]]);
    });
  })

  describe('collidesWithShip(ship)', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
      testShip.setPositions([0, 0], 180);
    })
    it('should return the ship and the locations if it collides with it', () => {
      const collidingShip = new Ship();
      collidingShip.setPositions([0, 1], 180);
      const results = collidingShip.collidesWithShip(testShip);
      results.should.deep.equal(testShip, [[0, 1], [0, 2]]);
    })
    it('should return false if there are no collisions', () => {

    })
  })
})
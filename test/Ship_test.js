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
    it('should default to the DEFAULT type', () => {
      testShip.type.should.equal(SHIP_TYPES.DEFAULT.NAME)
      testShip.segments.should.deep.equal(SHIP_TYPES.DEFAULT.SEGMENTS);
    });
    it('should contain the proper segments and type if given a type', () => {
      const destroyer = new Ship(SHIP_TYPES.DESTROYER);
      const battleship = new Ship(SHIP_TYPES.BATTLESHIP);

      destroyer.segments.should.deep.equal(SHIP_TYPES.DESTROYER.SEGMENTS);
      battleship.segments.should.deep.equal(SHIP_TYPES.BATTLESHIP.SEGMENTS);
    })
    it('should NOT contain a reference to the original segments', () => {
      const destroyer = new Ship(SHIP_TYPES.DESTROYER);
      const battleship = new Ship(SHIP_TYPES.BATTLESHIP);

      destroyer.segments.should.not.equal(SHIP_TYPES.DESTROYER.SEGMENTS);
      battleship.segments.should.not.equal(SHIP_TYPES.BATTLESHIP.SEGMENTS);
    })
  })

  describe('length()', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
    });
    it('should return the length of the ship in total segments', () => {
      testShip.length.should.equal(3);
      testShip.segments.push({ hp: 1 });
      testShip.length.should.equal(4);
    })
  })

  describe('totalHP()', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
    });
    it('should return the combined HP value of all segments when fetched', () => {
      testShip.totalHP.should.equal(3); // default is 1, 1, 1
      testShip.segments[0].hp = -1; // now it's -1, 1, 1
      testShip.totalHP.should.equal(1);
    });
    it('should require an integer when used as a setter', () => {
      const bad1 = () => testShip.totalHP = 1.1;
      const bad2 = () => testShip.totalHP = "5";

      bad1.should.throw(Error, /invalid value argument:/i)
      bad2.should.throw(Error, /invalid value argument:/i)
    })
    it('should set all hp to 0 if the input is 0', () => {
      testShip.totalHP = 0;
      testShip.totalHP.should.equal(0);
    })
    it('should distribute the input number as evenly as possible when used as a setter', () => {
      testShip.totalHP = 5;
      testShip.segments.map(segment => segment.hp).should.deep.equal([2, 2, 1]);
      testShip.totalHP = 1;
      testShip.segments.map(segment => segment.hp).should.deep.equal([1, 0, 0]);
    })
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
      testShip.collidesWith([[4, 5], [1, 1]]).should.be.false;
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
      results.should.deep.equal({ ship: testShip, collisions: [[0, 1], [0, 2]] });
    })
    it('should return false if there are no collisions', () => {
      const nonCollidingShip = new Ship();
      nonCollidingShip.setPositions([1, 0], 120);
      const results = nonCollidingShip.collidesWithShip(testShip);
      results.should.be.false;
    })
  })

  describe('segmentAt(position)', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
      testShip.setPositions([0, 0], 180);
    })
    it('should throw an error if the position is invalid', () => {
      const bad = () => testShip.segmentAt([1, 1.1]);
      bad.should.throw(Error, /invalid position argument:/i)
    })
    it('should return the segment at the given position if there is one', () => {
      testShip.segmentAt([0, 2]).should.equal(testShip.segments[2])
    })
    it('should return false if there are no segments at the given position', () => {
      testShip.segmentAt([0, 3]).should.be.false
    })
  })

  describe('damageSegments(positions, value)', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
      testShip.setPositions([0, 0], 180);
    })
    it('should reduce the HP of the segments at matching positions by the given value', () => {
      testShip.damageSegments([[0, 0], [0, 1]], 2);
      testShip.segments[0].hp.should.equal(-1)
      testShip.segments[1].hp.should.equal(-1)
      testShip.segments[2].hp.should.equal(1)
    });
    it('should work properly given a nested array or a single position', () => {
      testShip.damageSegments([[0, 2]], 1);
      testShip.segments[2].hp.should.equal(0)
    })
  });

  describe('destroy()', () => {
    let testShip;
    let fakeBoard
    before(() => {
      testShip = new Ship();
      testShip2 = new Ship();
      fakeBoard = { ships: [testShip, testShip2] }
      testShip.setOwner(fakeBoard);
      testShip2.setOwner(fakeBoard);
    })
    it('should remove the ship from its owning object', () => {
      testShip.destroy();
      fakeBoard.ships.includes(testShip).should.be.false;
      fakeBoard.ships.should.deep.equal([testShip2]);
    })
  })
})
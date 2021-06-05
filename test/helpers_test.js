const {
  validPosition,
  validAngle,
  getNeighbor } = require('../src/helpers/positionHelpers')

describe('validPosition(position)', () => {
  it('should return false if not given an array of size 2', () => {
    validPosition(5).should.be.false
    validPosition([4]).should.be.false
    validPosition([4, 5, 6]).should.be.false
  })
  it('should return false if given any non-integer arguments in the array', () => {
    validPosition([3, "4"]).should.be.false
    validPosition([3.3, 3]).should.be.false
  })
  it('should return true if given a size 2 array of integers', () => {
    validPosition([0, 0]).should.be.true
    validPosition([100, 100]).should.be.true
    validPosition([10000, 100000]).should.be.true
  })
})

describe('validAngle(angle)', () => {
  it('should return false if the angle is not valid for this board', () => {
    validAngle(270).should.be.false;
    validAngle(90).should.be.false;
  });
  it('should return true if this is a valid angle for this board', () => {
    validAngle(0).should.be.true;
    validAngle(60).should.be.true;
    validAngle(120).should.be.true;
    validAngle(180).should.be.true;
    validAngle(240).should.be.true;
    validAngle(300).should.be.true;
  })
})

describe('getNeighbor(position, angle)', () => {
  it('should require a valid position and angle', () => {
    const bad1 = () => getNeighbor();
    const bad2 = () => getNeighbor([3, 3]);
    const bad3 = () => getNeighbor([3, 3], 90);
    const bad4 = () => getNeighbor([0, testBoard.rows], 90);
    const good = () => getNeighbor([0, 0], 120);

    bad1.should.throw(Error, /invalid position argument:/i);
    bad2.should.throw(Error, /invalid angle argument:/i);
    bad3.should.throw(Error, /invalid argument:/i);
  });
  it('should return the position of the neighboring tile in the given direction');
  it('should return null if there is no tile in the given direction')
})

describe('getAllNeighbors(position)', () => {
  it('should return all neighboring tiles and their angle for the given position')
})
const { validPosition } = require('../src/helpers/positionHelpers')

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
const { positionIsValid } = require('../src/helpers/positionHelpers')
const positionHelpers = require('../src/helpers/positionHelpers')

describe('positionIsValid(position)', () => {
  const { positionIsValid } = positionHelpers;
  it('should return false if not given an array of size 2', () => {
    positionIsValid(5).should.be.false
    positionIsValid([4]).should.be.false
    positionIsValid([4, 5, 6]).should.be.false
  })
  it('should return false if given any non-integer arguments in the array', () => {
    positionIsValid([3, "4"]).should.be.false
    positionIsValid([3.3, 3]).should.be.false
  })
  it('should return true if given a size 2 array of integers', () => {
    positionIsValid([0, 0]).should.be.true
    positionIsValid([100, 100]).should.be.true
    positionIsValid([10000, 100000]).should.be.true
  })
})
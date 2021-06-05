const should = require('chai').should()
const Ship = require('../src/classes/Ship')

describe('Ship', () => {
  describe('Ship()', () => {
    let testShip;
    before(() => {
      testShip = new Ship();
    });
    it('should create an instance of a Ship', () => {
      should.exist(testShip)
    });
  })
})
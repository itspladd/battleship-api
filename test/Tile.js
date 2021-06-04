const should = require('chai').should()
const Tile = require('../src/classes/Tile')

describe('Tile', () => {
  describe('Tile()', () => {
    let testTile;
    before(() => {
      testTile = new Tile();
    });
    it('should create an instance of a tile', () => {
      should.exist(testTile)
    });
    it('should default to EMPTY type', () => {
      testTile.type.should.equal("EMPTY");
    })
  })
})
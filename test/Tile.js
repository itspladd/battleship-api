const should = require('chai').should()
const Tile = require('../src/classes/Tile')
const { TILE_TYPES } = require('../src/constants/TILES')

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
      testTile.type.should.equal(TILE_TYPES.EMPTY);
    });
    it('should create a tile of the given type if given an input parameter', () => {
      testTile = new Tile({type: TILE_TYPES.MISS})
      testTile.type.should.equal(TILE_TYPES.MISS);
    })
  })

  describe('changeType()', () => {
    it('should change the type of the tile')
  })
})
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
      testTile.typeStack.should.deep.equal([TILE_TYPES.EMPTY]);
    });
    it('should create a tile of the given type if given an input parameter', () => {
      testTile = new Tile({type: TILE_TYPES.MISS})
      testTile.typeStack.should.deep.equal([TILE_TYPES.MISS]);
    })
  })

  describe('addType()', () => {
    it('should add a new type to the tile', () => {
      const testTile = new Tile();
      testTile.addType(TILE_TYPES.HIT);
      testTile.typeStack.should.deep.equal([TILE_TYPES.EMPTY, TILE_TYPES.HIT])
    })
    it('should replace the existing type if given an extra parameter', () => {
      const testTile = new Tile();
      testTile.addType(TILE_TYPES.MISS);
      testTile.addType(TILE_TYPES.HIT, true);
      testTile.typeStack.should.deep.equal([TILE_TYPES.EMPTY, TILE_TYPES.HIT])
    })
  })
})
const should = require('chai').should()
const Board = require('../src/classes/Board')
const Ship = require('../src/classes/Ship')
const Tile = require('../src/classes/Tile')
const { TILE_TYPES } = require('../src/constants/TILES')

describe('Board', () => {
  describe('Board()', () => {
    let testBoard;
    before(() => {
      testBoard = new Board();
    });
    it('should create an instance of a Board', () => {
      should.exist(testBoard)
    });
    it('should default to a size of 10 by 10', () => {
      testBoard.rows.should.equal(10);
      testBoard.columns.should.equal(10);
    });
    it('should be full of Tile objects', () => {
      const rows = testBoard.tiles.length;
      const cols = testBoard.tiles[0].length;
      testBoard.tiles[0][0].should.be.an.instanceof(Tile);
      testBoard.tiles[rows / 2][cols / 2].should.be.an.instanceof(Tile);
      testBoard.tiles[rows - 1][cols - 1].should.be.an.instanceof(Tile);
    });
    it('should be able to change one Tile object without changing others', () => {
      testBoard.tiles[0][1].type = TILE_TYPES.SHIP.CRUISER;
      testBoard.tiles[0][0].type.should.equal(TILE_TYPES.EMPTY);
      testBoard.tiles[0][1].type.should.equal(TILE_TYPES.SHIP.CRUISER);
    });
    it('should be owned by a player, AI by default', () => {
      testBoard.owner.should.equal('AI');
      const newBoard = new Board({owner: 'Tautrion'});
      newBoard.owner.should.equal('Tautrion');
    })
  })

  describe('addShip()', () => {
    let testBoard;
    let testShip;
    before(() => {
      testBoard = new Board();
    })
    it('should add the Ship to the Ships owned by the Board', () => {
      const newShip = new Ship();
      testBoard.addShip(newShip);
      testBoard.ships[0].should.equal(newShip);
    })
  })
})
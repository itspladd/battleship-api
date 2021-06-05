const should = require('chai').should()
const Board = require('../src/classes/Board')
const Tile = require('../src/classes/Tile')

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
    })
    it('should be full of Tile objects', () => {
      const rows = testBoard.tiles.length;
      const cols = testBoard.tiles[0].length;
      testBoard.tiles[0][0].should.be.an.instanceof(Tile);
      testBoard.tiles[rows / 2][cols / 2].should.be.an.instanceof(Tile);
      testBoard.tiles[rows - 1][cols - 1].should.be.an.instanceof(Tile);
    })
    it('should be able to change one Tile object without changing others', () => {

    })
  })
})
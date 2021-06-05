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
  });

  describe('initTiles()', () => {
    it('should require two positive integers 1-15 as input', () => {
      let testBoard = new Board();
      const bad1 = () => testBoard.initTiles();
      const bad2 = () => testBoard.initTiles(0, 0);
      const bad3 = () => testBoard.initTiles(16, 5);
      const bad4 = () => testBoard.initTiles(-1, 10);
      const bad5 = () => testBoard.initTiles("1", "2");
      const good = () => testBoard.initTiles(10, 10);

      bad1.should.throw(Error, /invalid argument\(s\)/i);
      bad2.should.throw(Error, /invalid argument\(s\)/i);
      bad3.should.throw(Error, /invalid argument\(s\)/i);
      bad4.should.throw(Error, /invalid argument\(s\)/i);
      bad5.should.throw(Error, /invalid argument\(s\)/i);
      good.should.not.throw(Error);

    })
  });

  describe('addShip()', () => {
    let testBoard;
    let testShip;
    before(() => {
      testBoard = new Board();
    })
    it('should require a valid Ship, position, and angle', () => {
      const testShip = new Ship(); // Ship object
      const goodPosition = [1, 1]; // x and y
      const goodAngle = 180; // in degrees
      const badPosition = [-1, 11];
      const badAngle = 90;

      const bad1 = () => testBoard.addShip();
      const bad2 = () => testBoard.addShip(testShip);
      const bad3 = () => testBoard.addShip(testShip, goodPosition);
      const bad4 = () => testBoard.addShip(testShip, badPosition, goodAngle);
      const bad5 = () => testBoard.addShip(testShip, goodPosition, badAngle);
      const good = () => testBoard.addShip(testShip, goodPosition, goodAngle);

      bad1.should.throw(Error, /invalid ship argument:/i);
      bad2.should.throw(Error, /invalid position argument:/i);
      bad3.should.throw(Error, /invalid angle argument:/i);
      bad4.should.throw(Error, /invalid position argument:/i);
      bad5.should.throw(Error, /invalid angle argument:/i);
      good.should.not.throw(Error);

    })
    it('should add the Ship to the Ships owned by the Board', () => {
      const ship = new Ship();
      const position = [5, 5];
      const angle = 0;
      testBoard.addShip(ship, position, angle);
      testBoard.ships[testBoard.ships.length - 1].should.deep.equal({ ship, position, angle });
    })
  })
})
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

  describe('initTiles(rows, columns)', () => {
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
    it('should return an array of Tiles of the requested dimensions', () => {
      let testBoard = new Board;
      const tiles = testBoard.initTiles(4, 8);
      tiles.length.should.equal(4);
      tiles[0].length.should.equal(8);
      tiles[0][0].should.be.an.instanceof(Tile);
      tiles[3][7].should.be.an.instanceof(Tile);
    })
  });

  describe('addShip(ship, position, angle)', () => {
    let testBoard;
    before(() => {
      testBoard = new Board();
    })
    it('should return false and raise an error if the input is not a Ship', () => {
      testBoard.addShip().should.be.false;
    })
    it('should add the Ship to the Ships owned by the Board', () => {
      const ship = new Ship();
      ship.setPositions([1, 1], 180)
      testBoard.addShip(ship).should.be.true;
      testBoard.ships[testBoard.ships.length - 1].should.deep.equal(ship);
    })
  })

  describe('positionIsInsideBoard(position)', () => {
    let testBoard;
    before(() => {
      testBoard = new Board();
    })
    it('should return true if the given position is within the board', () => {
      testBoard.positionIsInsideBoard([0, 0]).should.be.true;
      testBoard.positionIsInsideBoard(testBoard.maxPosition).should.be.true;
    });
    it('should return false if the given position is outside the board', () => {
      testBoard.positionIsInsideBoard([0, -1]).should.be.false;
      testBoard.positionIsInsideBoard([-1, 0]).should.be.false;
      testBoard.positionIsInsideBoard([testBoard.columns, testBoard.rows]).should.be.false;
    });
    it('should return false and log an error if given an invalid position', () => {
      testBoard.positionIsInsideBoard(5).should.be.false;
      testBoard.positionIsInsideBoard([4]).should.be.false;
    });
  })

  describe('entireShipInsideBoard(ship)', () => {
    let testBoard;
    let testShip;
    before(() => {
      testBoard = new Board();
    });
    it('should return false if any of the Ship segments are outside the Board', () => {
      testShip = new Ship();
      testShip.setPositions([2, 0], 60);
      testBoard.entireShipInsideBoard(testShip).should.be.false;
      testShip.setPositions([2, 0], 300);
      testBoard.entireShipInsideBoard(testShip).should.be.false;
      testShip.setPositions([1, 2], 300);
      testBoard.entireShipInsideBoard(testShip).should.be.false;
    });
    it('should return true if the entire Ship is inside the Board', () => {
      testShip = new Ship();
      testShip.setPositions([0, 0], 120);
      testBoard.entireShipInsideBoard(testShip).should.be.true;

    });
  })

  describe('noShipCollisions(ship)', () => {
    let testBoard;
    let testShip1;
    let testShip2;
    before(() => {
      testBoard = new Board();
      testShip1 = new Ship();
      testShip1.setPositions([0, 0], 180);
      testBoard.ships = [testShip1];
    });
    it('should return true if no ships on the board collide with the input ship', () => {
      testShip2 = new Ship();
      testShip2.setPositions([1, 0], 120);
      testBoard.noShipCollisions(testShip2).should.be.true;
    })
    it('should return false if any ships collide with the input ship', () => {
      testShip2 = new Ship();
      testShip2.setPositions([2, 0], 240);
      testBoard.noShipCollisions(testShip2).should.be.false;
    })
  })

  describe('validShipLocation(ship)', () => {
    let testBoard;
    let testShip1;
    before(() => {
      testBoard = new Board();
      testShip1 = new Ship();
      testShip1.setPositions([0, 0], 180);
      testBoard.ships = [testShip1];
    });
    it('should return true if the ship is in the board and will not collide with other ships', () => {
      const newShip = new Ship();
      newShip.setPositions([1, 1], 60);
      testBoard.validShipLocation(newShip).should.be.true;
    })
    it('should return false if the ship is outside the board', () => {
      const newShip = new Ship();
      newShip.setPositions([1, 1], 0);
      testBoard.validShipLocation(newShip).should.be.false;
    })
    it('should return false if the ship collides with existing ships on the board', () => {
      const newShip = new Ship();
      newShip.setPositions([2, 1], 240);
      testBoard.validShipLocation(newShip).should.be.false;
    })
  })

  describe('shipAt(position)', () => {
    let testBoard;
    let testShip;
    before(() => {
      testBoard = new Board();
      testShip = new Ship();
      testBoard.addShip(testShip);
      testShip.setPositions([0, 0], 180);
    });
    it('should return the ship at the given position if there is one', () => {
      testBoard.shipAt([0, 2]).should.equal(testShip);
    });
    it('should return false if there are no ships at that position', () => {
      testBoard.shipAt([0, 3]).should.be.false;
    });
  })
})
const Player = require('../src/classes/Player')

const RULES = require('../src/constants/RULES')

describe('Player', () => {
  describe('Player()', () => {
    let testPlayer;
    it('should create a new Player object with a name and ID', () => {
      testPlayer = new Player(54, 'Tautrion');
      testPlayer._name.should.equal('Tautrion');
      testPlayer._id.should.equal(54);
    });
    it('should create a Board object owned by the Player if not given a board', () => {
      testPlayer = new Player(54, 'Trapezius');
      testPlayer.board.owner.should.equal(testPlayer);
    });
    it('should use the default ruleset if no rules are specified', () => {
      testPlayer = new Player(1, 'Tautrion');
      testPlayer.rules.should.equal(RULES.DEFAULT)
    })
  });
});
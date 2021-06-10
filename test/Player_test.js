describe('Player', () => {
  describe('Player()', () => {
    let testPlayer;
    it('should create a new Player object with a name and ID', () => {
      testPlayer = new Player(54, 'Tautrion');
      testPlayer.name.should.equal('Tautrion');
      testPlayer.id.should.equal(54);
    });
  });
});
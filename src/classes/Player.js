// Classes
const Board = require('../classes/Board')

// Constants
const RULES = require('../constants/RULES');

// Helpers
const { argErrorMsg, handleError } = require('../helpers/errorHelpers');

class Player {
  constructor (id, name, rules) {
    this.id = id;
    this.name = name;
    this.rules = rules || RULES.DEFAULT;
    this.board = new Board({ owner: this, ships: this.rules.SHIP_LIST });
  }

  get id() {
    return this._id;
  }

  set id(value) {
    if (!Number.isInteger(value) && !(typeof value === 'string')) {
        throw new Error(argErrorMsg(value, 'value', { name: 'Player.id' }));
    }

    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (!(typeof value === 'string')) {
      throw new Error(argErrorMsg(value, 'value', { name: 'Player.name' }));
    }

    this._name = value;
  }

  get board() {
    return this._board;
  }

  set board(boardObj) {
    if(!boardObj instanceof Board) {
      throw new Error(argErrorMsg(boardoBJ, 'boardObj', { name: 'Player.board'}));
    }

    this._board = boardObj;
  }
}

module.exports = Player;
const ERRORS = require('./constants/ERRORS');
const GLOBAL = require('./constants/GLOBAL');
const RULES = require('./constants/RULES');
const SHIPS = require('./constants/SHIPS');
const TILES = require('./constants/TILES');

const GameEngine = require('./classes/GameEngine');

module.exports = {
  CONSTANTS: {
    ERRORS,
    GLOBAL,
    RULES,
    SHIPS,
    TILES
  },
  GameEngine
}
const SHIP_TYPES = {
  DEFAULT: {
    NAME: "DEFAULT",
    SEGMENTS: [ { hp: 1 }, { hp: 1 }, { hp: 1 } ]
  },
  AIRCRAFT_CARRIER: {
    NAME: "AIRCRAFT_CARRIER",
    SEGMENTS: [ { hp: 1 }, { hp: 1 }, { hp: 1 }, { hp: 1 }, { hp: 1 } ]
  },
  BATTLESHIP: {
    NAME: "BATTLESHIP",
    SEGMENTS: [ { hp: 1 }, { hp: 1 }, { hp: 1 }, { hp: 1 } ]
  },
  CRUISER: {
    NAME: "CRUISER",
    SEGMENTS: [ { hp: 1 }, { hp: 1 }, { hp: 1 } ]
  },
  DESTROYER: {
    NAME: "DESTROYER",
    SEGMENTS: [ { hp: 1 }, { hp: 1 } ]
  },
  SUBMARINE: {
    NAME: "SUBMARINE",
    SEGMENTS: [ { hp: 1 }, { hp: 1 }, { hp: 1 } ]
  },
};

module.exports = {
  SHIP_TYPES
}
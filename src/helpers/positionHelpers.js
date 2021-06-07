const { VALID_ANGLES } = require('../constants/GLOBAL')

const validPosition = position => {
  return (
    Array.isArray(position) &&
    position.length === 2 &&
    Number.isInteger(position[0]) &&
    Number.isInteger(position[1])
  )
}

const validAngle = angle => {
  return VALID_ANGLES.includes(angle);
}

const getNeighbor = (position, angle) => {
  if (!validPosition(position)) {
    throw new Error(`Board.getNeighbor called with invalid position argument: ${position}`);
  }
  if (!validAngle(angle)) {
    throw new Error(`Board.getNeighbor called with invalid angle argument: ${angle}`);
  }
  const x = position[0];
  const y = position[1];
  let neighborPosition;

  if (x % 2 === 1) {
    // Case where x is odd
    switch (angle) {
      case 0:
        neighborPosition = [x, y - 1];
        break;
      case 60:
        neighborPosition = [x + 1, y];
        break;
      case 120:
        neighborPosition = [x + 1, y + 1];
        break;
      case 180:
        neighborPosition = [x, y + 1];
        break;
      case 240:
        neighborPosition = [x - 1, y + 1];
        break;
      case 300:
        neighborPosition = [x - 1, y];
        break;
    }
  } else if (x % 2 === 0) {
    // Case where x is even
    switch (angle) {
      case 0:
        neighborPosition = [x, y - 1];
        break;
      case 60:
        neighborPosition = [x + 1, y - 1];
        break;
      case 120:
        neighborPosition = [x + 1, y];
        break;
      case 180:
        neighborPosition = [x, y + 1];
        break;
      case 240:
        neighborPosition = [x - 1, y];
        break;
      case 300:
        neighborPosition = [x - 1, y - 1];
        break;
    }
  }

  return neighborPosition;
};

const getAllNeighbors = position => {
  return VALID_ANGLES.map(angle => getNeighbor(position, angle))
};

module.exports = {
  validPosition,
  validAngle,
  getNeighbor,
  getAllNeighbors
}
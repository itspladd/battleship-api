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

const getNeighbor = (position, angle, maxPosition) => {
  if (!validPosition(position)) {
    throw new Error(`getNeighbor called with invalid position argument: ${position}`);
  }
  if (!validAngle(angle)) {
    throw new Error(`getNeighbor called with invalid angle argument: ${angle}`);
  }
  if (!validPosition(maxPosition)) {
    throw new Error(`getNeighbor called with invalid maxPosition argument: ${maxPosition}`);
  }
  if (
    maxPosition[0] < position[0] ||
    maxPosition[1] < position[1]
  ) {
    throw new Error(`getNeighbor called with position exceeding maxPosition: 
      position: ${position}
      maxPosition: ${maxPosition}`);
  }
}

module.exports = {
  validPosition,
  validAngle,
  getNeighbor
}
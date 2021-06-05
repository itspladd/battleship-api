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


module.exports = {
  validPosition,
  validAngle
}
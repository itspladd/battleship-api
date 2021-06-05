const positionIsValid = (position) => {
  return (
    Array.isArray(position) &&
    position.length === 2 &&
    Number.isInteger(position[0]) &&
    Number.isInteger(position[1])
  )
}

module.exports = {
  positionIsValid
}
const argErrorMsg = (arg, argName, callingFunc) => {
    return `${callingFunc.name} called with invalid ${argName} argument: [${typeof arg}]${arg}`
}

const handleError = err => {
  console.error(err);
}

module.exports = {
  argErrorMsg,
}
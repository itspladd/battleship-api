const argErrorMsg = (arg, argName, callingFunc) => {
    return `${callingFunc.name} called with invalid ${argName} argument: [${typeof arg}]${arg}`
}

module.exports = {
  argErrorMsg,
}
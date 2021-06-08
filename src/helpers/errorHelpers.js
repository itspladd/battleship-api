const argErrorMsg = (arg, argName, callingFunc) => {
    return `${callingFunc.name} called with invalid ${argName} argument: [${typeof arg}]${arg}`
}

const handleError = err => {
  const redTextStr = '\x1b[31m%s\x1b[0m';
  console.error(redTextStr, '** ERROR *********')
  console.error(redTextStr, err);
  console.error(redTextStr, '******************')
}

module.exports = {
  argErrorMsg,
  handleError
}
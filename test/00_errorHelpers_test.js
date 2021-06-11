const {
  argErrorMsg
} = require('../src/helpers/errorHelpers')

describe('argErrorMsg(arg, argName, callingFunc)', () => {
  it('should return the appropriate error message', () => {
    const callingFunc = () => { };
    const result = argErrorMsg(5, 'testArg', callingFunc);

    result.should.equal(`callingFunc called with invalid testArg argument:
  * [number]
  * 5`);
  })
})
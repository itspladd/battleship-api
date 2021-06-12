const { 
  shuffleArray,
  noDuplicateUnderscoresRecursive
} = require('../src/helpers/generalHelpers')

describe('noDuplicateUnderscoresRecursive()', () => {
  it('should detect underscores in nested objects'), () => {
    const badObj1 = { test: 1, _test: 3 };
    const badObj2 = { test: 1, test2: { a: { a: 1, _a: 2 }}};
    const goodObj1 = { a: 1, b: { _a: 3, _b: 2 } };
    const goodObj2 = { a: 1, b: { a: 3, b: { b: 1, _b: 2 }}}
    noDuplicateUnderscoresRecursive(badObj1).should.be.false;
    noDuplicateUnderscoresRecursive(badObj2).should.be.true;
    noDuplicateUnderscoresRecursive(goodObj1).should.be.true;
    noDuplicateUnderscoresRecursive(goodObj2).should.be.true;
  }
})


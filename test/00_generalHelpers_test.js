const should = require('chai').should()

const { 
  shuffleArray,
  noDuplicateUnderscoresRecursive,
  stripUnderscoresRecursive
} = require('../src/helpers/generalHelpers')

describe('noDuplicateUnderscoresRecursive()', () => {
  it('should detect underscores in nested objects', () => {
    const badObj1 = { test: 1, _test: 3 };
    const badObj2 = { test: 1, test2: { a: { a: 1, _a: 2 }}};
    const goodObj1 = { a: 1, b: { _a: 3, _b: 2 } };
    const goodObj2 = { a: 1, b: { a: 3, b: { b: 1, _a: 2 }}};
    const bad1 = () => noDuplicateUnderscoresRecursive(badObj1)
    const bad2 = () => noDuplicateUnderscoresRecursive(badObj2)
    bad1.should.throw(Error);
    bad2.should.throw(Error);
    noDuplicateUnderscoresRecursive(goodObj1).should.be.true;
    noDuplicateUnderscoresRecursive(goodObj2).should.be.true;
  });
})

describe('stripUnderscoresRecursive()', () => {
  it('should remove leading underscores from all object keys', () => {
    const obj1 = { _a: 1, _b: 2 };
    const obj2 = { a: { _b: 2, _c: 1 }, b: { b: 2, c: { _a: 1, b:2 }}}
    stripUnderscoresRecursive(obj1)
    stripUnderscoresRecursive(obj2)
    obj1.should.deep.equal( { a: 1, b: 2 })
    obj2.should.deep.equal({ a: { b: 2, c: 1 }, b: { b: 2, c: { a: 1, b:2 }}})
  })
})
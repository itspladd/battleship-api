// Mock the console.error function so it doesn't blast the mocha test output.
before(() => {
  console.error = () => { };
})
// Shuffles an array in-place using Fisher-Yates, copied from https://javascript.info/array-methods#shuffle-an-array
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const noDuplicateUnderscoresRecursive = (obj, original = true) => {
  const keys = Object.keys(obj)
  for (const key of keys) {
    if (keys.includes(`_${key}`)) {
      return false;
    }
    if (obj[key] instanceof Object) {
      noDuplicateUnderscoresRecursive(obj[key], false)
    }
  }
  if (original) {
    return true;
  }
}

module.exports = {
  shuffleArray,
  noDuplicateUnderscoresRecursive
}
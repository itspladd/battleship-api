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
      throw new Error(`Found duped underscore _${key} in object ${obj}`);
    }
    if (obj[key] instanceof Object) {
      noDuplicateUnderscoresRecursive(obj[key], false)
    }
  }
  if (original) {
    return true;
  }
}

const stripUnderscoresRecursive = (obj) => {
  const keys = Object.keys(obj);
  for (const key of keys) {
    // First go into any nested objects and strip underscores from THEIR keys
    if (obj[key] instanceof Object) {
      stripUnderscoresRecursive(obj[key]);
    }
    // Then strip the underscore from this key
    if (key[0] === '_') {
      const newKey = key.slice(1, key.length);
      // Check to make sure we're not losing any data! Check for duplicate underscores first.
      if (obj[newKey]) {
        throw new Error(`Attempted to strip underscores from an object with duplicated keys:
        keys: ${key}, ${newKey}
        object: ${obj}`);
      }
      obj[newKey] = obj[key];
      delete obj[key]
    }
  }
}

module.exports = {
  shuffleArray,
  noDuplicateUnderscoresRecursive,
  stripUnderscoresRecursive
}
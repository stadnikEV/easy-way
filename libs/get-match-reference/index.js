const getMinWords = require('./get-min-words');
const comb = require("combinations-generator")

module.exports = ({ arr, matchProcent, fieldName }) => {

  let result = [];

  if (!arr) {
    const obj = {};
    obj[fieldName] = { $all: ['a'] };
    result.push(obj);
    return result;
  }


  let minWords = getMinWords({
    numperWords: arr.length,
    matchProcent,
  });

  for (minWords; minWords <= arr.length; minWords += 1) {
    const iterator = comb(arr, minWords);

    for (let item of iterator) {
      const obj = {};
      obj[fieldName] = { $all: item };
      result.push(obj);
    }
  }

  if (result.length === 0) {
    const obj = {};
    obj[fieldName] = { $all: [] };
    result.push(obj);
  }

  return result;
};

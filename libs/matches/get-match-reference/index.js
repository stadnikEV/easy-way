const getMinWords = require('./get-min-words');
const comb = require("combinations-generator")

module.exports = ({ arr, matchProcent, fieldName }) => {
  const result = [];
  let minWords = getMinWords({
    numperWords: arr.length,
    matchProcent,
  });

  for (minWords; minWords <= arr.length; minWords += 1) {
    const iterator = comb(arr, minWords);

    for (var item of iterator) {
      const obj = {};
      obj[fieldName] = { $all: item };
      result.push(obj);
    }
  }

  return result;
};

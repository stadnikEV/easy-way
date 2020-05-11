const XlsxToJsonFile = require('./libs/xlsx-to-json-file')
const jsonFileToObject = require('./libs/json-file-to-object')
const findMatches = require('./libs/matches/find-matches')
const getResultMatches = require('./libs/matches/get-result-matches')
const removeDirectory = require('./libs/remove-directory')

let dataLength = null

console.log('чтение xlsx')

removeDirectory({ path: './excel/result-match/origin.json' })
  .then(() => {
    return XlsxToJsonFile({
      input: 'excel/result/Результат.xlsx',
      output: 'excel/result-match/origin.json',
    })
  })
  .then(() => {
    return jsonFileToObject({ path: 'excel/result-match/origin.json' })
  })
  .then((data) => {
    dataLength = data.length
    return findMatches(data.reverse())
  })
  .then((result) => {
    getResultMatches(result, dataLength)
  })
  .then(() => {
    return removeDirectory({ path: './excel/result-match/origin.json' });
  })
  .catch((e) => {
    console.log(e)
  })
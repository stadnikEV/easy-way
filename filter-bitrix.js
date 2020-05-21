const XlsxToJsonFile = require('./libs/xlsx-to-json-file')
const jsonFileToObject = require('./libs/json-file-to-object')
const findMatches = require('./libs/matches/find-matches')
const getResultMatches = require('./libs/matches/get-result-matches')
const removeDirectory = require('./libs/remove-directory')
const createDirectory = require('./libs/create-directory')

let dataLength = null

console.log('чтение xlsx')

removeDirectory({ path: '../result-filter-bitrix' })
  .then(() => {
    return createDirectory({ path: '../result-filter-bitrix' })
  })
  .then(() => {
    return XlsxToJsonFile({
      input: '../result-duplicate/Результат.xlsx',
      output: '../result-filter-bitrix/origin.json',
    })
  })
  .then(() => {
    return jsonFileToObject({ path: '../result-filter-bitrix/origin.json' })
  })
  .then((data) => {
    dataLength = data.length
    return findMatches(data.reverse())
  })
  .then((result) => {
    getResultMatches(result, dataLength)
  })
  .then(() => {
    return removeDirectory({ path: '../result-filter-bitrix/origin.json' });
  })
  .catch((e) => {
    console.log(e)
  })
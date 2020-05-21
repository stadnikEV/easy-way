const mongoose = require('./libs/mongoose');
const XlsxToJsonFile = require('./libs/xlsx-to-json-file');
const jsonFileToObject = require('./libs/json-file-to-object');
const saveToDB = require('./libs/save-to-db');
const removeEmptyEmail = require('./libs/remove-empty-email');
const removeEmptyName = require('./libs/remove-empty-name');
const removeCompanyDuplicates = require('./libs/remove-company-duplicates');
const removeInstitutions = require('./libs/remove-institutions');
const removeBanDuplicates = require('./libs/remove-ban-duplicates');
const getResult = require('./libs/get-result');
const addId = require('./libs/add-id');
const saveOriginToBanByIds = require('./libs/save-origin-to-ban-by-ids');
const saveOriginToCompanyDuplicateByIds = require('./libs/save-origin-to-company-duplicate-by-ids');
const saveOriginToInstitutionsByIds = require('./libs/save-origin-to-institutions-by-ids');
const dropDatabase = require('./libs/drop-database');
const removeDirectory = require('./libs/remove-directory');
const createDirectory = require('./libs/create-directory');
const checkValidPhones = require('./libs/check-valid-phones');
const setStartPosition = require('./libs/set-start-position');
const setIgnoreEmptyEmail = require('./libs/set-ignore-empty-email');
const removeIgnorePhones = require('./libs/remove-ignore-phones');
const getAdditionalFields = require('./libs/get-additional-fields');


console.log('\033[2J');

let numberOrigin = 0;
let ban = null;
let validNames = null;
let ignorePhones = null;
let startPosition = 0;

dropDatabase()
  .then(() => {
    return removeDirectory({ path: '../ban.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../valid-names.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../ignore-words.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../ignore-phones.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../origin.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../result-duplicate' });
  })
  .then(() => {
    return createDirectory({ path: '../result-duplicate' });
  })
  .then(() => {
    return setStartPosition();
  })
  .then((position) => {
    startPosition = position;
    return setIgnoreEmptyEmail();
  })
  .then(() => {
    console.log('Чтение XLSX');
    return XlsxToJsonFile({
      input: '../valid-names.xlsx',
      output: '../valid-names.json',
    })
  })
  .then(() => {
    return jsonFileToObject({ path: '../valid-names.json' });
  })
  .then((data) => {
    validNames = data;
    return XlsxToJsonFile({
      input: '../ignore-phones.xlsx',
      output: '../ignore-phones.json',
    })
  })
  .then(() => {
    return jsonFileToObject({ path: '../ignore-phones.json' });
  })
  .then((data) => {
    ignorePhones = data;
    return XlsxToJsonFile({
      input: '../ban.xlsx',
      output: '../ban.json',
    })
  })
  .then(() => {
    return jsonFileToObject({ path: '../ban.json' });
  })
  .then((data) => {
    ban = data;
    ban = addId(ban);
    return checkValidPhones({data, fileName: 'Ban'});
  })
  .then(() => {
    return XlsxToJsonFile({
      input: '../origin.xlsx',
      output: '../origin.json',
    });
  })
  .then(() => {
    return jsonFileToObject({ path: '../origin.json', startPosition });
  })
  .then((data) => {
    getAdditionalFields({ fields: data[0] })
    data = addId(data, startPosition);
    data = removeIgnorePhones({ data, ignorePhones });
    return checkValidPhones({data, fileName: 'Origin'});
  })
  .then((data) => {
    numberOrigin = data.length;
    return removeEmptyEmail(data);
  })
  .then((data) => {
    return removeEmptyName({ data, validNames });
  })
  .then((data) => {
    return saveToDB(data);
  })
  .then(() => {
    return removeInstitutions();
  })
  .then((ids) => {
    return saveOriginToInstitutionsByIds({ ids })
  })
  .then(() => {
    return removeCompanyDuplicates();
  })
  .then((ids) => {
    return saveOriginToCompanyDuplicateByIds({ ids });
  })
  .then(() => {
    return removeBanDuplicates(ban);
  })
  .then((ids) => {
    return saveOriginToBanByIds({ ids });
  })
  .then(() => {
    return getResult({ numberOrigin });
  })
  .then(() => {
    return removeDirectory({ path: '../origin.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../ban.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../ignore-words.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../valid-names.json' });
  })
  .then(() => {
    return removeDirectory({ path: '../ignore-phones.json' });
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch((e) => {
    console.log(e);
  })


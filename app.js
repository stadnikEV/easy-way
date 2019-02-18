const express = require('express');
const http = require('http');
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


const app = express();
app.set('port', 8080);
console.log('\033[2J');

let numberOrigin = 0;
let ban = null;
let startPosition = 0;

dropDatabase()
  .then(() => {
    return removeDirectory({ path: './excel/result' });
  })
  .then(() => {
    return createDirectory({ path: './excel/result' });
  })
  .then(() => {
    return setStartPosition();
  })
  .then((position) => {
    startPosition = position;
    console.log('Чтение XLSX');
    return XlsxToJsonFile({
      input: 'excel/ban.xlsx',
      output: 'excel/ban.json',
    })
  })
  .then(() => {
    return jsonFileToObject({ path: 'excel/ban.json' });
  })
  .then((data) => {
    ban = data;
    return checkValidPhones({data, fileName: 'Ban'});
  })
  .then(() => {
    return XlsxToJsonFile({
      input: 'excel/origin.xlsx',
      output: 'excel/origin.json',
    });
  })
  .then(() => {
    return jsonFileToObject({ path: 'excel/origin.json', startPosition });
  })
  .then((data) => {
    return checkValidPhones({data, fileName: 'Origin'});
  })
  // .then((data) => {
  //   const show = require('./libs/show');
  //   data = addId(data);
  //   show(data);
  // })
  .then((data) => {
    console.log(data);
    numberOrigin = data.length;
    data = addId(data);
    return removeEmptyEmail(data);
  })
  .then((data) => {
    return removeEmptyName(data);
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
    return removeDirectory({ path: './excel/origin.json' });
  })
  .then(() => {
    return removeDirectory({ path: './excel/ban.json' });
  })
  .then(() => {
    return removeDirectory({ path: './excel/ignore-words.json' });
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch((e) => {
    console.log(e);
  })



http.createServer(app).listen(8080, () => {});

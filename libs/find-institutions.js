const XlsxToJsonFile = require('./xlsx-to-json-file');
const jsonFileToObject = require('./json-file-to-object');

module.exports = () => {
  const promise = new Promise((resolve, reject) => {
    const Company = require('../models/company');

    XlsxToJsonFile({
      input: 'excel/ignore-words.xlsx',
      output: 'excel/ignore-words.json',
    })
    .then(() => {
      return jsonFileToObject({ path: 'excel/ignore-words.json' });
    })
    .then((data) => {
      const words = [];
      data.forEach((item) => {
        words.push(item.words.toLowerCase());
      });

      return Company.find({ companyName: { $in: words } });
    })
    .then((documents) => {
      const result = {
        id: [],
        _id: [],
      };
      documents.forEach((item) => {
        result._id.push(item._id);
        result.id.push(item.id);
      });

      resolve(result);
    })
    .catch((e) => {
      reject(e);
    });
  });

  return promise;
};

const removeDocuments = require('./remove-documents');
const findInstitutions = require('./find-institutions');


module.exports = () => {
  const promise = new Promise((resolve, reject) => {
    let resultIds = [];
    const Company = require('../models/company');

    findInstitutions()
      .then(({ id, _id }) => {
        if (id.length === 0) {
          return;
        }
        resultIds = id;
        return removeDocuments({ _id, Model: Company });
      })
      .then(() => {
        resolve(resultIds);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

const removeDocuments = require('./remove-documents');
const findBanDuplicates = require('./find-ban-duplicates');
const getEmail = require('./get-email');
const getWords = require('./get-words');
const createCompanyField = require('./create-company-field');
const getPhones = require('./get-phones');
const _cliProgress = require('cli-progress');


module.exports = (dataBan) => {
  const promise = new Promise((resolve, reject) => {
    const resultIds = [];
    const Company = require('../models/company');
    // let banCount = 0;

    const bar = new _cliProgress.Bar({
      format: `Поиск ban [{bar}]`
    }, _cliProgress.Presets.shades_classic);
    const barTotal = dataBan.length;
    bar.start(barTotal, 0);

    const getBan = () => {
      const ban = dataBan.pop();
      bar.update(barTotal - dataBan.length);
      ban.companyName = createCompanyField({ companyName: ban.companyName })
      ban.email = getEmail({ email: ban.email });
      ban.fio = ban.fio.toLowerCase();
      ban.fio = getWords({ string: ban.fio });
      ban.phone = getPhones(ban.phone);

      findBanDuplicates(ban)
        .then(({ duplicateId, duplicate_id }) => {
          if (duplicateId.length === 0) {
            return;
          }
          resultIds.push(duplicateId);
          // banCount += duplicate_id.length;
          return removeDocuments({ _id: duplicate_id, Model: Company });
        })
        .then(() => {
          if (!dataBan.length) {
            // console.log(`Совпадения бан: ${banCount}`);
            bar.stop();
            resolve(resultIds);
            return;
          }

          getBan();
        })
        .catch((e) => {
          reject(e);
        });
    }

    getBan();
  });

  return promise;
};

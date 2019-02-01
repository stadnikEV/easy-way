const findCompanyDuplicates = require('./find-company-duplicates');
const removeDocuments = require('./remove-documents');
const getCollectionsId = require('./get-collections-id');
const _cliProgress = require('cli-progress');

module.exports = () => {
  const promise = new Promise((resolve, reject) => {
    const Company = require('../models/company');

    const bar = new _cliProgress.Bar({
      format: 'Поиск дубликатов [{bar}]'
    }, _cliProgress.Presets.shades_classic);

    // let duplicateCompany = 0;
    let resultIds = [];
    getCollectionsId(Company)
      .then((ids) => {
        const totalIds = ids.length;
        bar.start(totalIds, 0);

        const removeDuplicate = () => {
          if (!ids.length) {
            resolve([]);
            return;
          }
          const id = ids.pop().id;
          bar.update(totalIds - ids.length);

          findCompanyDuplicates(id)
            .then(({ duplicateId, duplicate_id }) => {
              if (duplicateId.length === 0) {
                return;
              }

              // duplicateCompany += duplicateId.length;

              // duplicateId.push(id);
              resultIds.push(duplicateId);


              for (let i = 0; i < ids.length; i = i + 1) {
                const itemId = ids[i].id;
                for (let j = 0; j < duplicateId.length; j = j + 1) {
                  const dup = duplicateId[j];
                  if (itemId === dup) {

                    ids.splice(i, 1);
                    i = i - 1;
                    break;
                  }
                }
              }

              return removeDocuments({ _id: duplicate_id, Model: Company });
            })
            .then(() => {
              if (!ids.length) {
                // bar.update(100);
                bar.stop();
                // console.log(`Совпадения компаний: ${duplicateCompany}`);
                resolve(resultIds);
                return;
              }

              removeDuplicate();
            })
            .catch((e) => {
              reject(e);
            });
        }

        removeDuplicate(ids);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

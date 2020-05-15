const saveAll = require('./mongoose-save-all');
const mongoose = require('../libs/mongoose');
const _cliProgress = require('cli-progress');
const getAdditionalFields = require('./get-additional-fields');

module.exports = ({ ids }) => {
  const promise = new Promise((resolve, reject) => {
    const Origin = require('../models/origin');
    const CompanyDuplicate = require('../models/company-duplicate');

    const bar = new _cliProgress.Bar({
      format: `Сохранение дубликатов [{bar}]`
    }, _cliProgress.Presets.shades_classic);
    const barTotal = ids.length;
    bar.start(barTotal, 0);

    if (ids.length === 0) {
      resolve();

      return;
    }

    const save = () => {
      const duplicateId = ids.pop();
      bar.update(barTotal - ids.length);

      const id = duplicateId.map((item) => item.duplicate)

      Origin.find({ id })
        .then((documents) => {
          const group = documents[documents.length - 1].id;
          const duplicateDoc = [];

          documents.forEach((doc) => {
            duplicateDoc.push(new CompanyDuplicate({
              _id: new mongoose.Types.ObjectId(),
              id: doc.id,
              companyName: doc.companyName,
              inn: doc.inn,
              address: doc.address,
              fio: doc.fio,
              service: doc.service,
              email: doc.email,
              phone: doc.phone,
              originDuplicate: duplicateId[0].origin,
              group,
              ...getAdditionalFields({ row: doc }),
            }));
          });

          duplicateDoc.push(new CompanyDuplicate({
            _id: new mongoose.Types.ObjectId(),
            id: '',
            companyName: '',
            inn: '',
            address: '',
            fio: '',
            service: '',
            email: '',
            phone: '',
            group,
          }));

          return saveAll({ documents: duplicateDoc });
        })
        .then(() => {
          if (!ids.length) {
            bar.stop();
            resolve();
            return;
          }

          save();
        })
        .catch((e) => {
          reject(e)
        });
    }

    save();
  });

  return promise;
}

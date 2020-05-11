const saveAll = require('./mongoose-save-all');
const mongoose = require('../libs/mongoose');
const getAdditionalFields = require('./get-additional-fields');

module.exports = ({ ids }) => {
  const promise = new Promise((resolve, reject) => {
    const Origin = require('../models/origin');
    const Ban = require('../models/ban');

    if (ids.length === 0) {
      resolve();

      return;
    }

    const save = () => {
      const id = ids.pop();

      Origin.find({ id })
        .then((documents) => {
          const group = documents[documents.length - 1].id;
          const banDoc = [];
          documents.forEach((doc) => {
            banDoc.push(new Ban({
              _id: new mongoose.Types.ObjectId(),
              id: doc.id,
              companyName: doc.companyName,
              inn: doc.inn,
              address: doc.address,
              fio: doc.fio,
              service: doc.service,
              email: doc.email,
              phone: doc.phone,
              group,
              ...getAdditionalFields({ row: doc }),
            }));
          });
          banDoc.push(new Ban({
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

          return saveAll({ documents: banDoc });
        })
        .then(() => {
          if (!ids.length) {
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

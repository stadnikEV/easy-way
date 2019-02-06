const saveAll = require('./mongoose-save-all');
const mongoose = require('../libs/mongoose');

module.exports = ({ ids }) => {
  const promise = new Promise((resolve, reject) => {
    const Origin = require('../models/origin');
    const Institutions = require('../models/institutions');


    if (ids.length === 0) {
      resolve();

      return;
    }


    Origin.find({ id: ids })
      .then((origin) => {
        const documents = [];

        origin.forEach((item) => {
          const institutions = new Institutions({
            _id: new mongoose.Types.ObjectId(),
            id: item.id,
            companyName: item.companyName,
            inn: item.inn,
            address: item.address,
            fio: item.fio,
            service: item.service,
            email: item.email,
            phone: item.phone,
          });

          documents.push(institutions);
        });

        return saveAll({ documents, barMessg: 'Поиск учереждений' });
      })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e)
      });
  });

  return promise;
}

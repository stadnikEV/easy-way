const mongoose = require('../libs/mongoose');
const saveAll = require('./mongoose-save-all');
const isValidNames = require('./is-valid-names');
const _cliProgress = require('cli-progress');
const getName = require('./get-name');
const getAdditionalFields = require('./get-additional-fields');

module.exports = ({ data, validNames }) => {
  const promise = new Promise((resolve, reject) => {
    const bar = new _cliProgress.Bar({
      format: 'Поиск пустых ФИО [{bar}]'
    }, _cliProgress.Presets.shades_classic);
    bar.start(data.length, 0);

    const EmptyName = require('../models/empty-name');
    const createModel = (row) => {
      return new EmptyName({
        _id: new mongoose.Types.ObjectId(),
        id: row.id,
        companyName: row.companyName,
        inn: row.inn,
        address: row.address,
        fio: row.fio,
        firstName: row.firstName,
        lastName: row.lastName,
        fatherName: row.fatherName,
        service: row.service,
        email: row.email,
        phone: row.phone,
        ...getAdditionalFields({ row }),
      });
    };

    // let epmptyCount = 0;
    const result = [];
    const models = [];

    data.forEach((row, index) => {
      bar.update(index + 1);

      let name = getName({
        fio: row.fio,
        lastName: row.lastName,
        firstName: row.firstName,
        fatherName: row.fatherName,
      });


      validName = isValidNames({ name, validNames });

      if (!validName) {
        models.push(createModel({ ...row,
          fio: row.fio,
          lastName: row.lastName || '',
          firstName: row.firstName || '',
          fatherName: row.fatherName || '' }));
        return;
      }

      result.push(row);
    });
    bar.stop();

    saveAll({ documents: models, barMessg: 'Сохранение ФИО в базу' })
      .then(() => {
        // console.log(`Пустые ФИО:: ${epmptyCount}`);
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
}

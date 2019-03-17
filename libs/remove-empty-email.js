const getEmail = require('./get-email');
const mongoose = require('../libs/mongoose');
const saveAll = require('./mongoose-save-all');
const _cliProgress = require('cli-progress');
const getName = require('./get-name');

module.exports = (data) => {
  const promise = new Promise((resolve, reject) => {
    const bar = new _cliProgress.Bar({
      format: 'Поиск пустых email [{bar}]'
    }, _cliProgress.Presets.shades_classic);
    bar.start(data.length, 0);

    const EmptyEmail = require('../models/empty-email');

    const createModel = (row) => {
      let name = getName({
        fio: row.fio,
        lastName: row.lastName,
        firstName: row.firstName,
        fatherName: row.fatherName,
      });
      if (name === null) {
        name = {};
        name.fio = '';
        name.lastName = '';
        name.firstName = '';
        name.fatherName = '';
      }

      return new EmptyEmail({
        _id: new mongoose.Types.ObjectId(),
        id: row.id,
        companyName: row.companyName,
        inn: row.inn,
        address: row.address,
        fio: `${name.lastName} ${name.firstName} ${name.fatherName}`,
        firstName: name.firstName,
        lastName: name.lastName,
        fatherName: name.fatherName,
        service: row.service,
        email: row.email,
        phone: row.phone,
      });
    };

    const result = [];
    const models = [];

    data.forEach((row, index) => {
      bar.update(index + 1);
      let email = getEmail({ email: row.email });

      if (global.isIgnoreEmptyEmail) {
        email = [];
      }

      if (!email) {
        models.push(createModel(row));
        return;
      }

      row.email = email;
      result.push(row);
    });

    bar.stop();

    saveAll({ documents: models, barMessg: 'Сохранение email в базу' })
      .then(() => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
}

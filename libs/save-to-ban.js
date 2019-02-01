const mongoose = require('../libs/mongoose');
const saveAll = require('./mongoose-save-all');


module.exports = (data) => {
  const promise = new Promise((resolve, reject) => {
    const Ban = require('../models/ban');

    const documents = [];
    data.forEach((row) => {
      const ban = new Ban({
        _id: new mongoose.Types.ObjectId(),
        companyName: row.companyName,
        inn: row.inn,
        address: row.address,
        fio: [row.lastName, row.firstName, row.fatherName].join(' '),
        firstName: row.firstName,
        lastName: row.lastName,
        fatherName: row.fatherName,
        service: row.service,
        email: row.email.join(' '),
        phone: row.phone,
        group: row.group,
      });

      documents.push(ban);
    })

    saveAll(documents)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

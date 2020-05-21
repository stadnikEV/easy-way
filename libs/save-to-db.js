const mongoose = require('./mongoose');
const saveAll = require('./mongoose-save-all');
const createCompanyField = require('./create-company-field');
const getPhones = require('./get-phones');
const getName = require('./get-name');
const getNumber = require('./get-number');
const slicePhones = require('./slice-phones');
const getAdditionalFields = require('./get-additional-fields');

module.exports = (data) => {
  const promise = new Promise((resolve, reject) => {
    const Origin = require('../models/origin');
    const Company = require('../models/company');

    const documents = [];
    data.forEach((row) => {
      const name = getName({
        fio: row.fio,
        lastName: row.lastName,
        firstName: row.firstName,
        fatherName: row.fatherName,
      });
      const firstName = name.firstName;
      const lastName = name.lastName;
      const fatherName = name.fatherName;
      const phone = getPhones({
        phones: row.phone,
        truePhone: row.truePhone,
        ignoredPhone: row.ignoredPhone,
      });

      const origin = new Origin({
        _id: new mongoose.Types.ObjectId(),
        id: row.id,
        companyName: row.companyName,
        inn: row.inn,
        address: row.address,
        fio: [lastName, firstName, fatherName].join(' '),
        firstName,
        lastName,
        fatherName,
        service: row.service,
        email: row.email.join(' '),
        phone: slicePhones({ phone }),
        ...getAdditionalFields({ row }),
      });

      const company = new Company({
        _id: new mongoose.Types.ObjectId(),
        id: row.id,
        companyName: createCompanyField({ companyName: row.companyName }),
        fio: [lastName.toLowerCase(), firstName.toLowerCase(), fatherName.toLowerCase()],
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        fatherName: fatherName.toLowerCase(),
        inn: getNumber({ string: row.inn }),
        email: row.email,
        phone,
      });

      documents.push(company);
      documents.push(origin);
    })

    saveAll({ documents, barMessg: 'Сохранение компаний в базу' })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

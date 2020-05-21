
module.exports = (id) => {
  const promise = new Promise((resolve, reject) => {
    const Company = require('../models/company');

    Company.findOne({ id }, ['companyName', 'inn', 'lastName', 'firstName', 'fatherName', 'phone', 'email', '-_id'])
      .then((document) => {
        return Company.find({ $or: [
          {
            phone: { $in: document.phone },
            id: { $ne: id },
          },
          {
            inn: { $in: document.inn },
            id: { $ne: id },
          },
          {
            email: { $in: document.email },
            id: { $ne: id },
          },
          {
            companyName: { $all: document.companyName },
            id: { $ne: id },
            lastName: document.lastName,
            firstName: document.firstName,
            fatherName: document.fatherName,
          },
        ]}, ['id', 'phone'])})
      .then((documents) => {
        const result = {
          duplicateId: [],
          duplicate_id: [],
        };
        documents.forEach((item) => {
          result.duplicate_id.push(item._id);
          result.duplicateId.push({
            duplicate: item.id,
            origin: id,
          });
        });

        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

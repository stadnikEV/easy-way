
module.exports = (ban) => {
  const promise = new Promise((resolve, reject) => {
    const Company = require('../models/company');

    Company.find({ $or: [
      {
        email: { $in: ban.email },
      },
      {
        phone: { $in: ban.phone },
      },
      {
        fio: { $all: ban.fio },
        companyName: { $all: ban.companyName },
      },
    ]})
      .then((documents) => {
        const result = {
          duplicateId: [],
          duplicate_id: [],
        };
        documents.forEach((item) => {
          result.duplicate_id.push(item._id);
          result.duplicateId.push(item.id);
        });

        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

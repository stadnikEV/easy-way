const getMatchReference = require('../libs/get-match-reference');


module.exports = (ban) => {
  const promise = new Promise((resolve, reject) => {
    const Company = require('../models/company');

    const companyQuery = getMatchReference({ arr: ban.companyName, fieldName: 'companyName', matchProcent: 50 });
    const fioQuery = getMatchReference({ arr: ban.fio, fieldName: 'fio', matchProcent: 59 });

    Company.find({ $or: [
      {
        email: { $in: ban.email },
      },
      {
        email: { $in: ban.corporateEmail },
      },
      {
        phone: { $in: ban.phone },
      },
      {
        inn: { $in: ban.inn },
      },
      {
        fio: { $all: ban.fio },
      },
      {
        companyName: { $all: ban.companyName },
      },
      {
        $and: [
          {
            $or : companyQuery,
          },
          {
            $or : fioQuery,
          }
        ]
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

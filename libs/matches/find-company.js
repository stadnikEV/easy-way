const getMatchReference = require('.//get-match-reference')

module.exports = ({ fio, company }) => {
  const Company = require('../../models/company-soma')

  return new Promise((resolve, reject) => {
    const matchCompanyProcent = 60
    const matchFioProcent = 59

    const companyQuery = getMatchReference({ arr: company, fieldName: 'companyName', matchProcent: matchCompanyProcent })
    const fioQuery = getMatchReference({ arr: fio, fieldName: 'fio', matchProcent: matchFioProcent })

    Company.find({
      $and: [
        {
         $or : companyQuery,
        },
        {
         $or : fioQuery,
        }
      ]
    }, ['-_id', "companyName", 'fio', 'email' ])
      .then((documents) => {
        if (documents.length === 0) {
          resolve(null)
          return
        }
        resolve(documents)
      })
      .catch((e) => {
        reject(e);
      })
  })
}

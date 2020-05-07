
module.exports = (inn) => {
  const Company = require('../../models/company-soma')

  return new Promise((resolve, reject) => {
    Company.find({ inn: { $in: inn } }, ['-_id', 'inn' ])
      .then((document) => {
        if (document.length === 0) {
          resolve(null)
          return
        }
        resolve(document)
      })
      .catch((e) => {
        reject(e)
      })
  })
}


module.exports = (email) => {
  const Company = require('../../models/company-soma')

  return new Promise((resolve, reject) => {
    Company.find({ email: { $in: email } }, ['-_id', 'email' ])
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

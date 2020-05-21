const findEmail = require('./find-email')
const getEmail = require('../get-email')
const stringToArray = require('./string-to-array')
const findInn = require('./find-inn')
const findCompany = require('./find-company')
const getProcent = require('../get-procent')
const getAdditionalFields = require('../get-additional-fields')


module.exports = (data) => {
  const dataLength = data.length
  const promise = new Promise((resolve, reject) => {
    const result = []
    const emailMatch = []
    const innMatch = []
    const companyMatch = []

    getAdditionalFields({ fields: data[0] })

    const find = async () => {
      if (data.length === 0) {
        resolve({
          result,
          emailMatch,
          innMatch,
          companyMatch,
          resultSite: result.filter((item) => item.site !== ''),
        })
        return
      }

      const company = data.pop()

      console.log('\033[2J')
      console.log(`Прогресс: ${getProcent({ full: dataLength, part: dataLength - data.length })}%`)

      const emailFound = await findEmail(getEmail({ email: company.Почта }))

      if (emailFound) {
        emailMatch.push(company)
        find().catch((e) => reject(e))
        return
      }

      const innFound = await findInn(stringToArray(company.ИНН))

      if (innFound) {
        innMatch.push(company)
        find().catch((e) => reject(e))
        return
      }

      const companyFound = await findCompany({
        fio: stringToArray(company.ФИО.toLowerCase()),
        company: stringToArray(company.Компания.toLowerCase()),
      })
      
      if (companyFound) {
        companyMatch.push(company)
        find().catch((e) => reject(e))
        return
      }

      result.push(company)

      find().catch((e) => reject(e))
    }

    find().catch((e) => reject(e))
  })

  return promise
}

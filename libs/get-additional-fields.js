let additionalFieldsName = null

module.exports = ({ fields, row }) => {
  const determinedFields = [
    'id',
    'companyName',
    'inn',
    'address',
    'fio',
    'firstName',
    'lastName',
    'fatherName',
    'service',
    'email',
    'phone',
    'Компания',
    'ИНН',
    'Адрес',
    'ФИО',
    'Фамилия',
    'Имя',
    'Отчество',
    'Отрасль',
    'Почта',
    'Телефоны',
    'OriginDuplicate',
  ]

  if (!additionalFieldsName) {
    additionalFieldsName = Object.keys(fields)
      .filter((item) => {
        if (determinedFields.indexOf(item) === -1) {
          return true
        }
        return false
      })
  }


  if (!fields && !row) {
    return additionalFieldsName
  }


  const additionalFields = {}

  if (!row) {
    return additionalFields
  }

  additionalFieldsName.forEach((item) => {
    if (row.get) {
      additionalFields[item] = row.get(item)
      return
    }
    additionalFields[item] = row[item]
  })

  return additionalFields
}





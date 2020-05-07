const saveToXlsx = require('../save-to-xlsx')
const getProcent = require('../get-procent')

module.exports = (data, dataLength) => {
  console.log('\033[2J')
  console.log('Сохранение результатов')

  const fields = [
    "id",
    'Компания',
    'ИНН',
    'Адрес',
    'ФИО',
    "Фамилия",
    "Имя",
    "Отчество",
    'Отрасль',
    'Почта',
    'Телефоны',
    'Выручка',
    'Стоимость',
  ]

  saveToXlsx({
    fields,
    data: data.result,
    path: 'excel/result-match/Результат.xlsx',
  })
  .then(() => {
    return saveToXlsx({
      fields,
      data: data.emailMatch,
      path: 'excel/result-match/Совпадения_email.xlsx',
    })
  })
  .then(() => {
    return saveToXlsx({
      fields,
      data: data.innMatch,
      path: 'excel/result-match/Совпадения_inn.xlsx',
    })
  })
  .then(() => {
    return saveToXlsx({
      fields,
      data: data.companyMatch,
      path: 'excel/result-match/Совпадения_fio_company.xlsx',
    })
  })
  .then(() => {
    console.log('\033[2J');
    console.log(`Начальное количество:    ${dataLength} (100%)`);
    console.log(`Совпадения email:        ${data.emailMatch.length} (${getProcent({ full: dataLength, part: data.emailMatch.length })}%)`);
    console.log(`Совпадения ИНН:          ${data.innMatch.length} (${getProcent({ full: dataLength, part: data.innMatch.length })}%)`);
    console.log(`Совпадения ФИО-КОМпания: ${data.companyMatch.length} (${getProcent({ full: dataLength, part: data.companyMatch.length })}%)`);
    console.log(`Резултат:                ${data.result.length} (${getProcent({ full: dataLength, part: data.result.length })}%)`);
  })
}
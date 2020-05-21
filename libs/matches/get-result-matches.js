const saveToXlsx = require('../save-to-xlsx')
const getProcent = require('../get-procent')
const getAdditionalFields = require('../get-additional-fields')

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
    ...getAdditionalFields({}),
  ]

  saveToXlsx({
    fields,
    data: data.result,
    path: '../result-filter-bitrix/Результат.xlsx',
  })
  .then(() => {
    return saveToXlsx({
      fields,
      data: data.resultSite,
      path: '../result-filter-bitrix/Результат_сайт.xlsx',
    })
  })
  .then(() => {
    return saveToXlsx({
      fields,
      data: data.emailMatch,
      path: '../result-filter-bitrix/Совпадения_email.xlsx',
    })
  })
  .then(() => {
    return saveToXlsx({
      fields,
      data: data.innMatch,
      path: '../result-filter-bitrix/Совпадения_inn.xlsx',
    })
  })
  .then(() => {
    return saveToXlsx({
      fields,
      data: data.companyMatch,
      path: '../result-filter-bitrix/Совпадения_fio_company.xlsx',
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
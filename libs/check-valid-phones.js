const getPhones = require('./get-phones');
const saveToTxt = require('./save-to-txt');

module.exports = ({ data, fileName }) => {
  const promise = new Promise((resolve, reject) => {
    const notValidId = [];

    data.forEach((company, index) => {
      if (!company.phone) {
        return;
      }

      if (getPhones({ phones: company.phone, truePhone: company.truePhone })) {
        return
      }
      company.id = index + 2;
      notValidId.push(company);
    });

    notValidPhones = '';

    if (notValidId.length !== 0) {
      notValidId.forEach((item) => {
        console.log(`ID: ${item.id}
ФИО: ${item.fio}
phone: ${item.phone}
`);
      notValidPhones += `ID: ${item.id}
ФИО: ${item.fio}
phone: ${item.phone}

`;
      saveToTxt({ path: 'not-valid-phones.txt', text: notValidPhones });
      });
      console.log(`Количество не валидных номеров: ${notValidId.length}`);
      reject(`В файле ${fileName} Найдены телефоны в разных форматах`);
      return;
    }

    resolve(data)
  });

  return promise;
}

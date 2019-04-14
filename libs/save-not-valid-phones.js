const saveToTxt = require('./save-to-txt');

module.exports = ({ companies, path }) => {
  return new Promise((resolve, reject) => {
    let notValidPhones = '';

    companies.forEach((item) => {
      const fio = (item.fio)
        ? item.fio
        : `${item.lastName} ${item.firstName} ${item.fatherName}`;

      console.log(`
ID: ${item.id}
  ФИО: ${fio}
  phone: ${item.phone}
  `);
    notValidPhones += `
ID: ${item.id}
  ФИО: ${fio}
  phone: ${item.phone}

  `;
    });

    saveToTxt({ path: `not-valid-phones-${path}.txt`, text: notValidPhones })
      .then(() => {
        console.log(`Количество не валидных номеров: ${companies.length}`);
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};

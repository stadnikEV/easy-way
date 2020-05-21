const getPhones = require('./get-phones');
const saveNotValidPhones = require('./save-not-valid-phones');
const setCreateTruePhones = require('./set-create-true-phones');

module.exports = ({ data, fileName }) => {
  const promise = new Promise((resolve, reject) => {
    const notValidCompany = [];

    data.forEach((company) => {
      if (!company.phone) {
        return;
      }

      if (getPhones({
        phones: company.phone,
        truePhone: company.truePhone,
        ignoredPhone: company.ignoredPhone,
      })) {
        return
      }
      notValidCompany.push(company);
    });



    if (notValidCompany.length !== 0) {
      saveNotValidPhones({ companies: notValidCompany, path: fileName })
        .then(() => {
          console.log(`В файле ${fileName} Найдены телефоны в разных форматах или код оператора не валидный`);
          return setCreateTruePhones();
        })
        .then((answer) => {
          if (!answer) {
            return Promise.reject('Вылнение программы остановлено');
          }
          notValidCompany.forEach((notValidCompany) => {
            data.forEach((item) => {
              if (item.id === notValidCompany.id) {
                item.truePhone = item.phone
                item.ignoredPhone = item.phone
              }
            });
          });
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });

      return;
    }

    resolve(data)
  });

  return promise;
}

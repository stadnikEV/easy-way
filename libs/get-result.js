const getCollectionsId = require('./get-collections-id');
const saveToXlsx = require('./save-to-xlsx');
// const saveToTxt = require('./save-to-txt');
// const saveToXlsx = require('./save-to-xlsx');
const getProcent = require('./get-procent');
const _cliProgress = require('cli-progress');


module.exports = ({ numberOrigin }) => {
  const promise = new Promise((resolve, reject) => {
    const Origin = require('../models/origin');
    const Company = require('../models/company');
    const Ban = require('../models/ban');
    const EmptyEmail = require('../models/empty-email');
    const CompanyDuplicate = require('../models/company-duplicate');
    const EmptyName = require('../models/empty-name');

    const bar = new _cliProgress.Bar({
      format: `Получение результата [{bar}]`
    }, _cliProgress.Presets.shades_classic);
    const barTotal = 14;
    bar.start(barTotal, 0);

    let numberEmptyEmail = 0;
    let numberEmptyFio = 0;
    let numberDuplicateCompany = 0;
    let numberBan = 0;
    let numberResult = 0;

    getCollectionsId(Company)
      .then((ids) => {
        bar.update(1);
        const id = [];
        ids.forEach((item) => {
          id.push(item.id)
        });

        return Origin
          .aggregate([
            {
              $match: { id: { $in: id } },
            },
            {
              $project: {
                _id: 0,
                "Название": "$companyName",
                "ИНН": "$inn",
                "Адрес": "$address",
                "ФИО": "$fio",
                "Фамилия": "$lastName",
                "Имя": "$firstName",
                "Отчество": "$fatherName",
                "Вид деятельности" : "$service",
                "email": "$email",
                "Телефоны": "$phone",
              },
            }
          ]);
      })
      .then((origin) => {
        bar.update(2);
        if (origin.length === 0) {
          return;
        }
        numberResult = origin.length;
        return saveToXlsx({
          fields: [
            'Название',
            'ИНН',
            'Адрес',
            'ФИО',
            "Фамилия",
            "Имя",
            "Отчество",
            'Вид деятельности',
            'email',
            'Телефоны',
          ],
          data: origin,
          path: 'excel/result/Результат.xlsx',
        })
      })
      .then(() => {
        bar.update(3);
        return CompanyDuplicate
        .aggregate([
          {
            $project: {
              _id: 0,
              "id": "$id",
              "Название": "$companyName",
              "Адрес": "$address",
              "ФИО": "$fio",
              "email": "$email",
              "Телефоны": "$phone",
            },
          }
        ]);
      })
      .then((duplicates) => {
        bar.update(4);
        if (duplicates.length === 0) {
          return;
        }
        duplicates.forEach((item) => {
          if (!item.id) {
            return;
          }
          numberDuplicateCompany += 1;
        });

        return saveToXlsx({
          fields: [
            "id",
            'Название',
            'Адрес',
            'ФИО',
            'email',
            'Телефоны',
          ],
          data: duplicates,
          path: 'excel/result/Дубликаты.xlsx',
        })
      })
      .then(() => {
        bar.update(5);
        return Ban
        .aggregate([
          {
            $project: {
              _id: 0,
              "id": "$id",
              "Название": "$companyName",
              "Адрес": "$address",
              "ФИО": "$fio",
              "email": "$email",
              "Телефоны": "$phone",
            },
          }
        ]);
      })
      .then((ban) => {
        bar.update(6);
        if (ban.length === 0) {
          return;
        }
        ban.forEach((item) => {
          if (!item.id) {
            return;
          }
          numberBan += 1;
        });

        return saveToXlsx({
          fields: [
            'id',
            'Название',
            'Адрес',
            'ФИО',
            'email',
            'Телефоны',
          ],
          data: ban,
          path: 'excel/result/Бан.xlsx',
        })
      })
      .then(() => {
        bar.update(7);
        return EmptyEmail
        .aggregate([
          {
            $project: {
              _id: 0,
              "id": "$id",
              "Название": "$companyName",
              "ИНН": "$inn",
              "Адрес": "$address",
              "ФИО": "$fio",
              "Фамилия": "$lastName",
              "Имя": "$firstName",
              "Отчество": "$fatherName",
              "Вид деятельности" : "$service",
              "email": "$email",
              "Телефоны": "$phone",
            },
          }
        ]);
      })
      .then((emptyEmail) => {
        bar.update(8);
        if (emptyEmail.length === 0) {
          return;
        }
        numberEmptyEmail = emptyEmail.length;
        return saveToXlsx({
          fields: [
            "id",
            'Название',
            'ИНН',
            'Адрес',
            'ФИО',
            "Фамилия",
            "Имя",
            "Отчество",
            'Вид деятельности',
            'email',
            'Телефоны',
          ],
          data: emptyEmail,
          path: 'excel/result/Пустые_email.xlsx',
        })
      })
      .then(() => {
        bar.update(9);
        return EmptyEmail
        .aggregate([
          {
            $match: { fatherName: { $ne: '' } },
          },
          {
            $project: {
              _id: 0,
              "id": "$id",
              "Название": "$companyName",
              "ИНН": "$inn",
              "Адрес": "$address",
              "ФИО": "$fio",
              "Фамилия": "$lastName",
              "Имя": "$firstName",
              "Отчество": "$fatherName",
              "Вид деятельности" : "$service",
              "email": "$email",
              "Телефоны": "$phone",
            },
          }
        ]);
      })
      .then((emptyEmail) => {
        bar.update(10);
        if (emptyEmail.length === 0) {
          return;
        }
        return saveToXlsx({
          fields: [
            "id",
            'Название',
            'ИНН',
            'Адрес',
            'ФИО',
            "Фамилия",
            "Имя",
            "Отчество",
            'Вид деятельности',
            'email',
            'Телефоны',
          ],
          data: emptyEmail,
          path: 'excel/result/Пустые_email_имена.xlsx',
        })
      })
      .then(() => {
        bar.update(11);
        return EmptyName
        .aggregate([
          {
            $project: {
              _id: 0,
              "id": "$id",
              "Название": "$companyName",
              "ИНН": "$inn",
              "Адрес": "$address",
              "ФИО": "$fio",
              "Фамилия": "$lastName",
              "Имя": "$firstName",
              "Отчество": "$fatherName",
              "Вид деятельности" : "$service",
              "email": "$email",
              "Телефоны": "$phone",
            },
          }
        ]);
      })
      .then((emptyName) => {
        bar.update(13);
        if (emptyName.length === 0) {
          return;
        }
        numberEmptyFio = emptyName.length;
        return saveToXlsx({
          fields: [
            "id",
            'Название',
            'ИНН',
            'Адрес',
            'ФИО',
            "Фамилия",
            "Имя",
            "Отчество",
            'Вид деятельности',
            'email',
            'Телефоны',
          ],
          data: emptyName,
          path: 'excel/result/Пустые_ФИО.xlsx',
        })
      })
      .then(() => {
        bar.update(14);
        const data = [{
          "Начальное количество": `${numberOrigin} (100%)`,
          "Пустые email": `${numberEmptyEmail} (${getProcent({ full: numberOrigin, part: numberEmptyEmail })}%)`,
          "Пустые ФИО": `${numberEmptyFio} (${getProcent({ full: numberOrigin, part: numberEmptyFio })}%)`,
          "Дубликаты": `${numberDuplicateCompany} (${getProcent({ full: numberOrigin, part: numberDuplicateCompany })}%)`,
          "Бан": `${numberBan} (${getProcent({ full: numberOrigin, part: numberBan })}%)`,
          "Результат": `${numberResult} (${getProcent({ full: numberOrigin, part: numberResult })}%)`,
        }];

        return saveToXlsx({
          fields: [
            "Начальное количество",
            'Пустые email',
            'Пустые ФИО',
            'Дубликаты',
            'Бан',
            "Результат",
          ],
          data,
          path: 'excel/result/Статистика.xlsx',
        })
      })
      .then(() => {
        bar.stop();
        console.log('\033[2J');
        console.log(`Начальное количество: ${numberOrigin} (100%)`);
        console.log(`Пустые email:         ${numberEmptyEmail} (${getProcent({ full: numberOrigin, part: numberEmptyEmail })}%)`);
        console.log(`Пустые ФИО:           ${numberEmptyFio} (${getProcent({ full: numberOrigin, part: numberEmptyFio })}%)`);
        console.log(`Дубликаты:            ${numberDuplicateCompany} (${getProcent({ full: numberOrigin, part: numberDuplicateCompany })}%)`);
        console.log(`Бан:                  ${numberBan} (${getProcent({ full: numberOrigin, part: numberBan })}%)`);
        console.log(`Резултат:             ${numberResult} (${getProcent({ full: numberOrigin, part: numberResult })}%)`);
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

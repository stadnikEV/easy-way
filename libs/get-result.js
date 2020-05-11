const getCollectionsId = require('./get-collections-id');
const saveToXlsx = require('./save-to-xlsx');
// const saveToTxt = require('./save-to-txt');
// const saveToXlsx = require('./save-to-xlsx');
const getProcent = require('./get-procent');
const _cliProgress = require('cli-progress');
const getAdditionalFields = require('./get-additional-fields');


const getAggregateFields = () => {
  const additionalFieldsName = getAdditionalFields({})
  const result = {}

  additionalFieldsName.forEach((item) => {
    result[item] = `$${item}`
  })

  return result
}


module.exports = ({ numberOrigin }) => {
  const promise = new Promise((resolve, reject) => {
    const Origin = require('../models/origin');
    const Company = require('../models/company');
    const Ban = require('../models/ban');
    const EmptyEmail = require('../models/empty-email');
    const CompanyDuplicate = require('../models/company-duplicate');
    const EmptyName = require('../models/empty-name');
    const Institutions = require('../models/institutions');

    const bar = new _cliProgress.Bar({
      format: `Получение результата [{bar}]`
    }, _cliProgress.Presets.shades_classic);
    const barTotal = 15;
    bar.start(barTotal, 0);

    let numberEmptyEmail = 0;
    let numberEmptyFio = 0;
    let numberDuplicateCompany = 0;
    let numberBan = 0;
    let numberInstitutions = 0;
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
              $sort : { id : 1 }
            },
            {
              $project: {
                _id: 0,
                "id": "$id",
                "Компания": "$companyName",
                "ИНН": "$inn",
                "Адрес": "$address",
                "ФИО": "$fio",
                "Фамилия": "$lastName",
                "Имя": "$firstName",
                "Отчество": "$fatherName",
                "Отрасль" : "$service",
                "Почта": "$email",
                "Телефоны": "$phone",
                ...getAggregateFields()
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
            ...getAdditionalFields({})
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
              "ИНН": "$inn",
              "Компания": "$companyName",
              "Адрес": "$address",
              "ФИО": "$fio",
              "Почта": "$email",
              "Телефоны": "$phone",
              "Отрасль" : "$service",
              ...getAggregateFields(),
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
            'ИНН',
            'Компания',
            'Адрес',
            'ФИО',
            'Почта',
            'Телефоны',
            'Отрасль',
            ...getAdditionalFields({})
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
              "ИНН": "$inn",
              "Компания": "$companyName",
              "Адрес": "$address",
              "ФИО": "$fio",
              "Почта": "$email",
              "Телефоны": "$phone",
              "Отрасль": "$service",
              ...getAggregateFields(),
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
            'ИНН',
            'Компания',
            'Адрес',
            'ФИО',
            'Почта',
            'Телефоны',
            "Отрасль",
            ...getAdditionalFields({}),
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
            $sort : { id : 1 }
          },
          {
            $project: {
              _id: 0,
              "id": "$id",
              "Компания": "$companyName",
              "ИНН": "$inn",
              "Адрес": "$address",
              "ФИО": "$fio",
              "Фамилия": "$lastName",
              "Имя": "$firstName",
              "Отчество": "$fatherName",
              "Отрасль" : "$service",
              "Почта": "$email",
              "Телефоны": "$phone",
              ...getAggregateFields(),
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
            ...getAdditionalFields({})
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
            $sort : { id : 1 }
          },
          {
            $project: {
              _id: 0,
              "id": "$id",
              "companyName": "$companyName",
              "inn": "$inn",
              "address": "$address",
              "fio": "$fio",
              "lastName": "$lastName",
              "firstName": "$firstName",
              "fatherName": "$fatherName",
              "service" : "$service",
              "email": "$email",
              "phone": "$phone",
              ...getAggregateFields(),
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
            'companyName',
            'inn',
            'address',
            'fio',
            "lastName",
            "firstName",
            "fatherName",
            'service',
            'email',
            'phone',
            ...getAdditionalFields({})
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
            $sort : { id : 1 }
          },
          {
            $project: {
              _id: 0,
              "id": "$id",
              "Компания": "$companyName",
              "ИНН": "$inn",
              "Адрес": "$address",
              "ФИО": "$fio",
              "Фамилия": "$lastName",
              "Имя": "$firstName",
              "Отчество": "$fatherName",
              "Отрасль" : "$service",
              "Почта": "$email",
              "Телефоны": "$phone",
              ...getAggregateFields(),
            },
          }
        ]);
      })
      .then((emptyName) => {
        bar.update(12);
        if (emptyName.length === 0) {
          return;
        }
        numberEmptyFio = emptyName.length;
        return saveToXlsx({
          fields: [
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
            ...getAdditionalFields({})
          ],
          data: emptyName,
          path: 'excel/result/Не_корректные_ФИО.xlsx',
        })
      })
      .then(() => {
        bar.update(13);
        return Institutions
        .aggregate([
          {
            $sort : { id : 1 }
          },
          {
            $project: {
              _id: 0,
              "id": "$id",
              "Компания": "$companyName",
              "ИНН": "$inn",
              "Адрес": "$address",
              "ФИО": "$fio",
              "Отрасль" : "$service",
              "Почта": "$email",
              "Телефоны": "$phone",
              ...getAggregateFields(),
            },
          }
        ]);
      })
      .then((institutions) => {
        bar.update(14);
        if (institutions.length === 0) {
          return;
        }
        numberInstitutions = institutions.length;
        return saveToXlsx({
          fields: [
            "id",
            'Компания',
            'ИНН',
            'Адрес',
            'ФИО',
            'Отрасль',
            'Почта',
            'Телефоны',
            ...getAdditionalFields({})
          ],
          data: institutions,
          path: 'excel/result/Учреждения.xlsx',
        })
      })
      .then(() => {
        bar.update(15);
        const data = [{
          "Начальное количество": `${numberOrigin} (100%)`,
          "Пустые email": `${numberEmptyEmail} (${getProcent({ full: numberOrigin, part: numberEmptyEmail })}%)`,
          "Не корректные ФИО": `${numberEmptyFio} (${getProcent({ full: numberOrigin, part: numberEmptyFio })}%)`,
          "Учреждения": `${numberInstitutions} (${getProcent({ full: numberOrigin, part: numberInstitutions })}%)`,
          "Дубликаты": `${numberDuplicateCompany} (${getProcent({ full: numberOrigin, part: numberDuplicateCompany })}%)`,
          "Бан": `${numberBan} (${getProcent({ full: numberOrigin, part: numberBan })}%)`,
          "Результат": `${numberResult} (${getProcent({ full: numberOrigin, part: numberResult })}%)`,
        }];

        return saveToXlsx({
          fields: [
            "Начальное количество",
            'Пустые email',
            'Не корректные ФИО',
            "Учреждения",
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
        console.log(`Не корректные ФИО:    ${numberEmptyFio} (${getProcent({ full: numberOrigin, part: numberEmptyFio })}%)`);
        console.log(`Учреждения:           ${numberInstitutions} (${getProcent({ full: numberOrigin, part: numberInstitutions })}%)`);
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

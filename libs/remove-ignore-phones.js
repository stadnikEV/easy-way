
module.exports = ({ data, ignorePhones }) => {
  data.forEach((company, index) => {
    ignorePhones.forEach((item) => {
      const regExp = new RegExp(item.phones, 'g');
      data[index].phone = company.phone.replace(regExp, '');
    });
  });

  return data;
}

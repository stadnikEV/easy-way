const codeOperator = require('./code-operator');

module.exports = (phones) => {

  const getNumbers = (phones) => {
    const numbers = phones.match(/[0-9]/g);
    if (!numbers) {
      return null;
    }
    return numbers.join('');
  };

  const getFormat = (numbers) => {
    if (numbers.length % 10 === 0) {
      return 10;
    }
    if (numbers.length % 11 === 0) {
      return 11;
    }
    return null;
  }

  const checkCountry = ({ number }) => {
    if (number === '7' || number === '8') {
      return true;
    }

    return false;
  }

  const checkOperator = ({ number }) => {
    if (number.length !== 3) {
      return false;
    }

    if (codeOperator.indexOf(number) === -1) {
      return false;
    }

    return true;
  }


  const checkPhone = ({ phone, format }) => {
    if (format === 11) {
      if (!checkCountry({ number: phone.slice(0, 1) })) {
        return false;
      }
      phone = phone.slice(1);
    }

    if (!checkOperator({ number: phone.slice(0, 3) })) {
      return false;
    }

    return true;
  }




  const getPhones = ({ numbers, format }) => {
    const result = [];
    const numberOfPhones = numbers.length / format;

    for (let i = 0; i < numberOfPhones; i += 1) {
      const phone = numbers.slice(i * format, format + (i * format));
      if (!checkPhone({ phone, format })) {
        return false;
      }
      result.push(phone);
    }

    return result;
  }


  const numbers = getNumbers(phones);

  if (!numbers) {
    return [];
  }

  const format = getFormat(numbers);

  if (!format) {
    return [];
  }

  const phone = getPhones({ numbers, format });

  if (!phone) {
    return [];
  }

  return phone;
};

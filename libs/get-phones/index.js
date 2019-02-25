const codeOperator = require('./code-operator');

module.exports = ({ phones, truePhone }) => {

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
    if (numbers.length < 19 && numbers.length % 6 === 0) {
      return 6;
    }
    if (numbers.length < 15 && numbers.length % 7 === 0) {
      return 7;
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
    let result = [];
    const numberOfPhones = numbers.length / format;

    for (let i = 0; i < numberOfPhones; i += 1) {
      let phone = numbers.slice(i * format, format + (i * format));

      if (format === 11) {
        const firstNumber = phone.slice(0, 1);
        if (firstNumber === '8') {
          phone = 7 + phone.slice(1);
        }
      }

      if (!global.isCheckOperator) {
        result.push(phone);
        continue;
      }

      if (format === 10 || format === 11) {
        if (!checkPhone({ phone, format })) {
          result = null;
          break;
        }
      }

      result.push(phone);
    }

    return result;
  }

  if (truePhone) {
    const phones = truePhone.match(/[0-9]+/g);
    if (!phones) {
      return null;
    }
    return phones;
  }


  const numbers = getNumbers(phones);

  if (!numbers) {
    return [];
  }

  const format = getFormat(numbers);

  if (!format) {
    return null;
  }

  const phone = getPhones({ numbers, format });

  return phone;
};

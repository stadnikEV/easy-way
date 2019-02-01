const getWords = require('./get-words');

module.exports = ({ fio, firstName, lastName, fatherName }) => {
  if (getWords({ string: firstName })[0]
  && getWords({ string: lastName })[0]
  && getWords({ string: fatherName })[0]
  ) {
    return {firstName, lastName, fatherName};
  }

  fio = getWords({ string: fio });
  if (fio.length !== 3) {
    return null;
  }
  return { lastName:fio[0], firstName:fio[1], fatherName:fio[2] };
};

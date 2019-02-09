const getWordsName = require('./get-words-name');

module.exports = ({ fio, firstName, lastName, fatherName }) => {
  if (getWordsName({ string: firstName }).length === 1
  && getWordsName({ string: lastName }).length === 1
  && getWordsName({ string: fatherName }).length === 1
  ) {
    return {
      firstName: getWordsName({ string: firstName })[0],
      lastName: getWordsName({ string: lastName })[0],
      fatherName: getWordsName({ string: fatherName })[0],
    };
  }

  fio = getWordsName({ string: fio });
  if (fio.length !== 3) {
    return null;
  }
  return { lastName:fio[0], firstName:fio[1], fatherName:fio[2] };
};

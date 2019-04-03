
module.exports = ({ name, validNames }) => {
  if (!name) {
    return null;
  }

  let isFirstName = false;
  let isFatherName = false;

  validNames.forEach((item) => {
    const firstName = name.firstName.toLowerCase().replace(/ё/, 'е');
    const fatherName = name.fatherName.toLowerCase().replace(/ё/, 'е');
    if (item.firstName === firstName) {
      isFirstName = true;
    }
    if (item.fatherName === fatherName) {
      isFatherName = true;
    }
  });
  if (!isFirstName || !isFatherName) {
    return null;
  }
  return name;
};

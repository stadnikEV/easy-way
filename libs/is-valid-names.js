
module.exports = ({ name, validNames }) => {
  if (!name) {
    return null;
  }

  let isFirstName = false;
  let isFatherName = false;

  validNames.forEach((item) => {
    if (item.firstName === name.firstName.toLowerCase()) {
      isFirstName = true;
    }
    if (item.fatherName === name.fatherName.toLowerCase()) {
      isFatherName = true;
    }
  });
  if (!isFirstName || !isFatherName) {
    return null;
  }
  return name;
};


module.exports = ({ string }) => {
  if (typeof string !== 'string') {
    return [];
  }
  const word = string.match(/[a-zA-Z0-9а-яА-ЯёЁ]+/g);
  if (!word) {
    return [];
  }

  return word;
};

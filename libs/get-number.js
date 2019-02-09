
module.exports = ({ string }) => {
  if (typeof string !== 'string') {
    return [];
  }
  const number = string.match(/[0-9]+/g);
  if (!number) {
    return [];
  }

  return number;
};

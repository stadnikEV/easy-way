
module.exports = ({ string }) => {
  if (typeof string !== 'string') {
    return [];
  }
  string = string.replace(/ё/g, 'е');
  string = string.replace(/Ё/g, 'Е');

  const word = string.match(/([a-zA-Z0-9а-яА-ЯёЁ]+\s*-\s*[a-zA-Z0-9а-яА-ЯёЁ]+|[a-zA-Z0-9а-яА-ЯёЁ]+)/g);
  if (!word) {
    return [];
  }

  return word;
};

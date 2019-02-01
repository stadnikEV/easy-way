
module.exports = ({ companyName }) => {
  let result = companyName;
  result = result.toLowerCase();

  return result.match(/[a-zA-Z0-9а-яА-ЯёЁ]+/g);
}

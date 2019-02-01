
module.exports = (data) => {

  data.forEach((row, index) => {
    row.id = index + 2;
  });

  return data;
}

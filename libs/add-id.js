
module.exports = (data, startPosition = 0) => {

  data.forEach((row, index) => {
    row.id = index + 2 + startPosition;
  });

  return data;
}

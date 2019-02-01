
module.exports = ({ reference, current }) => {
  let result = false;

  reference.forEach((emailReference) => {
    const match = current.some((emailCurrent) => {
      return emailCurrent === emailReference;
    });
    if (match) {
      result = true;
    }
  });

  return result;
}

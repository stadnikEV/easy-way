const xlsxj = require("xlsx-to-json");

module.exports = ({ input, output }) => {
  const promise = new Promise((resolve, reject) => {
    xlsxj({ input, output }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  return promise;
}

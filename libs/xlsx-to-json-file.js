const xlsxj = require("xlsx-to-json");

module.exports = ({ input, output }) => {
  const promise = new Promise((resolve, reject) => {
    xlsxj({ input, output }, function(err, result) {
      if (err) {
        reject(err);
      } else {
        setTimeout(() => {
          resolve(result);
        }, 500)
      }
    });
  });

  return promise;
}

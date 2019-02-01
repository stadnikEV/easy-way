const fs = require('fs');

module.exports = ({ path }) => {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);

        return;
      }

      resolve(data);
    });
  });

  return promise;
};

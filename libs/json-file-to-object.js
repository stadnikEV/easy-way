const readFile = require('./read-file');

module.exports = ({ path, startPosition = 0 }) => {
  const promise = new Promise((resolve, reject) => {
    readFile({ path })
      .then((json) => {
        const obj = JSON.parse(json).slice(startPosition);
        resolve(obj);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

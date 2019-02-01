const readFile = require('./read-file');

module.exports = ({ path }) => {
  const promise = new Promise((resolve, reject) => {
    readFile({ path })
      .then((json) => {
        resolve(JSON.parse(json));
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
};

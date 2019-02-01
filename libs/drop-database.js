const mongoose = require('../libs/mongoose');

module.exports = () => {
  const promise = new Promise((resolve, reject) => {

    mongoose.connection.on('open', (err) => {
      if (err) {
        reject(err);
        return;
      }

      mongoose.connection.db.dropDatabase((err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      })
    })
  });

  return promise;
}


module.exports = (model) => {
  const promise = new Promise((resolve, reject) => {
    model.find({}, { id: 1, _id: 0 })
      .then((id) => {
        resolve(id);
      })
      .catch((e) => {
        reject(e);
      })
  });

  return promise;
};

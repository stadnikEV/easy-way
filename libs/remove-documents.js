
module.exports = ({ _id, Model }) => {
  const promise = new Promise((resolve, reject) => {
    if (_id.length === 0) {
      resolve();

      return;
    }

    Promise.all(_id.map((id) => {
      return Model.remove({ _id: id });
    }))
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });

  return promise;
}

const _cliProgress = require('cli-progress');

module.exports = ({ documents, barMessg }) => {
  const promise = new Promise((resolve, reject) => {
    if (!documents.length) {
      resolve();
      return;
    }
    if (barMessg) {
      var bar = new _cliProgress.Bar({
        format: `${barMessg} [{bar}]`
      }, _cliProgress.Presets.shades_classic);
      var barTotal = documents.length;
      bar.start(barTotal, 0);
    }

    const saveAll = () => {
      var doc = documents.pop();

      doc.save()
        .then(() => {
          if (barMessg) {
            bar.update(barTotal - documents.length, 0);
          }

          if (!documents.length) {
            if (barMessg) {
              bar.stop();
            }

            resolve();
            return;
          }

          saveAll();
        })
        .catch((e) => {
          reject(e);
        });
    };

    saveAll();
  });

  return promise;
}

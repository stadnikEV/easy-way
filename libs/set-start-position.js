const readline = require('readline');

module.exports = () => {
  const promise = new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Ведите начальную позицию: ', function(position) {
      rl.close();
      if (!position) {
        resolve(0);
        return;
      }
      resolve(position - 2);
    });
  });

  return promise;
}

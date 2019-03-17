const readline = require('readline');

module.exports = () => {
  const promise = new Promise((resolve) => {
    const ask = () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Игнорировать пустые email?: ', function(isIgnoreEmail) {
        rl.close();
        if (!isIgnoreEmail || isIgnoreEmail === 'no') {
          global.isIgnoreEmptyEmail = false;
          resolve();
          return;
        }
        if (isIgnoreEmail === 'yes') {
          global.isIgnoreEmptyEmail = true;
          resolve();
          return;
        }
        console.log('Укажите "yes" или "no"');
        ask();
      });
    }

    ask();
  });

  return promise;
}

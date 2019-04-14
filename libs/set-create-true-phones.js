const readline = require('readline');

module.exports = () => {
  const promise = new Promise((resolve) => {
    const ask = () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Оставить телефоны как есть?: ', function(answer) {
        rl.close();
        if (!answer || answer === 'no') {
          resolve(false);
          return;
        }
        if (answer === 'yes') {
          resolve(true);
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

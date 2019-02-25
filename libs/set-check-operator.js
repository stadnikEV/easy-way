const readline = require('readline');

module.exports = () => {
  const promise = new Promise((resolve) => {
    const ask = () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Отменить проверку кода оператора?: ', function(isCheckOperator) {
        rl.close();
        if (!isCheckOperator || isCheckOperator === 'no') {
          global.isCheckOperator = true;
          resolve();
          return;
        }
        if (isCheckOperator === 'yes') {
          global.isCheckOperator = false;
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

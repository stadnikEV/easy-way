const isMatch = require('./is-match');

module.exports = (data) => {
  let matches = 0;
  for (let i = 0; i < data.length; i = i + 1) {
    const emailReference = data[i].email;

    for (let j = i + 1; j < data.length; j = j + 1) {
      const currentEmail = data[j].email;
      const match = isMatch({
        reference: emailReference,
        current: currentEmail,
      });
      if (match) {
        matches += 1;
        data.splice(j, 1);
        j = j - 1;
      }
    }
  }

  console.log(`Совпадений email: ${matches}`);
  return data;
}

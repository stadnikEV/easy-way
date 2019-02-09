const getEmail = require('./get-email');

module.exports = (data) => {
  const emailHight = {};
  const emailLower = {};



  data.forEach((row) => {
    if (getEmail({ email: row.email })) {
      emailHight[row.id] = getEmail({ email: row.email });
    }
    if (getEmail({ email: row.email.toLowerCase() })) {
      emailLower[row.id] = getEmail({ email: row.email.toLowerCase() });
    }
  });



  Object.keys(emailHight).forEach((item) => {

    if (!emailLower[item]) {
      console.log(item, emailHight[item]);
      console.log(item, emailLower[item]);
      console.log();
    }
  });

  console.log('Завершено');
}

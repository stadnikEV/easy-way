const mongoose = require('../libs/mongoose-soma');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  companyName: [
    String,
  ],
  fio: [
    String,
  ],
  email: [
    String,
  ],
  inn: [
    String,
  ],
  adress: [
    String,
  ],
  phone: [
    String,
  ],
  created: {
    type: Date,
    default: Date.now
  },
});

const Company = mongoose.model('Company', schema);

module.exports = Company;
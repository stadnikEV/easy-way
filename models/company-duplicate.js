const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  id: {
    type: Number,
  },
  companyName: String,
  group: String,
  inn: String,
  address: String,
  fio: String,
  service: String,
  email: String,
  phone: String,
  originDuplicate: String,
  created: {
    type: Date,
    default: Date.now
  },
}, { strict: false });

const CompanyDuplicate = mongoose.model('CompanyDuplicate', schema);

module.exports = CompanyDuplicate;

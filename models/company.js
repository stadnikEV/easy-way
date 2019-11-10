const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  id: {
    type: Number,
    unique: true,
    required: true
  },
  companyName: [
    String,
  ],
  address: String,
  firstName: String,
  lastName: String,
  fatherName: String,
  email: [
    String,
  ],
  inn: [
    String,
  ],
  group: Number,
  phone: [
    String,
  ],
  fio: [
    String,
  ],
  earnings: String,
  cost: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Company = mongoose.model('Company', schema);

module.exports = Company;

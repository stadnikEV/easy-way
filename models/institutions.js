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
  firstName: String,
  lastName: String,
  fatherName: String,
  service: String,
  email: String,
  phone: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Institutions = mongoose.model('Institutions', schema);

module.exports = Institutions;

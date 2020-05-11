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
  companyName: String,
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
}, { strict: false });

const Origin = mongoose.model('Origin', schema);

module.exports = Origin;

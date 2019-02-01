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
  inn: String,
  address: String,
  fio: String,
  firstName: String,
  lastName: String,
  fatherName: String,
  service: String,
  email: String,
  phone: String,
  group: Number,
  created: {
    type: Date,
    default: Date.now
  },
});

const Ban = mongoose.model('Ban', schema);

module.exports = Ban;

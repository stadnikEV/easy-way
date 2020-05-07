const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/soma');

module.exports = mongoose;

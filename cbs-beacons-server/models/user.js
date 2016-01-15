var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
  firsName: String,
  lastName: String,
  password: String, // password should be hashed before saving
  email: String
});

module.exports = mongoose.model('User', UserSchema);

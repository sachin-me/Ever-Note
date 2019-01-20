var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const saltRounds = 10;


var Schema = mongoose.Schema;
let RegisterUser = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
})

RegisterUser.pre('save', function(next) {
  console.log(this.password);
  this.password = bcrypt.hashSync(this.password, saltRounds);
  console.log(this.password, 'inside Pre');
  next();
})

var Register = mongoose.model('Register', RegisterUser);
module.exports = Register;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const saltRounds = 10;


var Schema = mongoose.Schema;
let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
})

userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  console.log(this.password, 'inside Pre');
  next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;
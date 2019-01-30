const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const Schema = mongoose.Schema;
let userSchema = new Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,
  provider: String,
  google: {
    name: String, 
    photo: String
  }
})

userSchema.pre('save', function(next) {
  console.log(this.password, 'check password');
  if(this.password) {
    console.log('Inside pre save')
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
  } else {
    console.log('passed')
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const Schema = mongoose.Schema;
let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  posts: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

userSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
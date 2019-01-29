const User = require('./../model/User');
var passport = require('passport');
var bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;


module.exports = (passport) => {
    passport.use(new LocalStrategy({
    usernameField: 'email'
  },
    function(email, password, done) {
      User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
        return done(null, user);
      })
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


}
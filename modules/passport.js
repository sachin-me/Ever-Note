const mongoose = require('mongoose');
var User = mongoose.model('User');

// const User = require('../model/User');
var passport = require('passport');
var bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// Passport Local Strategy 

// User.find({}, (err, users) => {
//   console.log(users);
// })

module.exports = (passport) => {
  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function (email, password, done) {
      User.findOne({
        email: email
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      })
    }
  ));

  // Passport Google Strategy

  passport.use(new GoogleStrategy({
      clientID: '752087943922-s1edqd9k6c5mt60ubu9lm0d2bf0oa87b.apps.googleusercontent.com',
      clientSecret: '9cyih3jGxTMQ5mRExGiNMzD1',
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {

      User.findOne({email: profile.emails[0].value}, (err, user) => {
        console.log(profile, user);
        if (err) return done(err);
        if (!user) {
          console.log('No user present');
          var newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'google',
            google: {name: profile.displayName, photo: profile.photos[0].value}
          });
          newUser.save(function(err, user) {
            console.log(err, user, 'create user');
            return done(err, user);
          })
          
        }

        if (user) {
          if(user.provider && user.provider == profile.provider) {
            return done(err, user);
          }
          // Update user
          
          User.findByIdAndUpdate(user._id, {provider: profile.provider, google: {
            name: profile.displayName,
            photo: profile.photos[0].value
          }},
          {new: true}, (err, user) => {
            return done(err, user);
          })
        }

       

        
      })
    }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
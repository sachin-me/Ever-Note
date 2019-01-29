const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

const PostBlog = mongoose.model('PostBlog');
const User = mongoose.model('User');

/* GET home page. */

router.get('/', (req, res) => {
  let userId = req.user ? req.user._id : null;
  PostBlog.find({}, (err, posts) => {
    if (err) res.status(500).send(err);
    res.render('posts', {posts: posts, userId: userId, user: req.user});
  })
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.post('/register', (req, res) => {
  const registeredUser = new User(req.body);
  registeredUser.save((err) => {
    if (err) throw err;
    res.redirect('/login');
  })
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', (req, res) => {
  req.session.destroy();
  req.logOut();
  res.redirect('/');
})


module.exports = router;
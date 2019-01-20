var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var PostBlog = mongoose.model('PostBlog');
var Register = mongoose.model('Register');

/* GET home page. */

router.get('/', (req, res) => {
  PostBlog.find({}, (err, posts) => {
    console.log(posts);
    if (err) res.status(500).send(err);
    res.render('posts', {posts: posts});
  })
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.post('/register', (req, res) => {
  var registeredUser = new Register(req.body);
  console.log(registeredUser);
  registeredUser.save((err) => {
    if (err) throw err;
    res.redirect('/');
  })
})

module.exports = router;

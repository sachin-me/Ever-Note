var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var PostBlog = mongoose.model('PostBlog');
var User = mongoose.model('User');

var isUser = (req, res, next) => {
  if(req.session.UserId) {
    User.findById(req.session.UserId, (err, user) => {
      req.user = user;
      res.locals.user = user;
    });
    return next();
    
  }
  res.status(403).redirect('/login');
};


/* GET home page. */

router.get('/', isUser, (req, res) => {
  PostBlog.find({}, (err, posts) => {
    console.log(req.session);
    if (err) res.status(500).send(err);
    res.render('posts', {posts: posts});
  })
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.post('/register', (req, res) => {
  var registeredUser = new User(req.body);
  console.log(registeredUser);
  registeredUser.save((err) => {
    if (err) throw err;
    res.redirect('/');
  })
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', (req, res) => {
  var {email, password} = req.body;
  User.findOne({email: email}, (err, user) => {
    if(err) res.status(500).send(err);
    if(!user) res.status(400).json({error: 'User does not exist'});
    if(!bcrypt.compareSync(password, user.password)) res.status(400).json({error: 'Incorrect Password'});
    req.session.UserId = user._id;
    res.redirect('/');
  })


})

module.exports = router;

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Register = mongoose.model('Register');

router.get('/registerUser', (req, res) => {
  res.render('register');
})
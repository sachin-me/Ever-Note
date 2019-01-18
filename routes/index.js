var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var PostBlog = mongoose.model('PostBlog');

/* GET home page. */

// router.get('/', (req, res) => {
//   PostBlog.find({}, (err, posts) => {
//     console.log(posts);
//     if (err) res.status(500).send(err);
//     res.render('posts', {posts: posts});
//   })
// })

module.exports = router;

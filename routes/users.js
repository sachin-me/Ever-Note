var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var PostBlog = mongoose.model('PostBlog');
var CommentPost = mongoose.model('CommentPost');

/* GET users listing. */

router.get('/posts/newPost', (req, res) => {
  res.render('newPost');
})

router.post('/', (req, res) => {
  var newPost = new PostBlog(req.body);
  console.log(newPost);
  newPost.save(err => {
    if (err) throw err;
    res.redirect('/');
  })
})

router.get('/', (req, res) => {
  PostBlog.find({}, (err, posts) => {
    console.log(posts);
    if (err) res.status(500).send(err);
    res.render('posts', {posts: posts});
  })
})

router.get('/posts/:id/edit', (req, res) => {
  let id = req.params.id;
  PostBlog.findById(id, (err, post) => {
    console.log(post);
    if (err) res.status(500).send(err);
    res.render('editPost', {post: post})
  })
})

router.post('/posts/:id', (req, res) => {
  let id = req.params.id;

  PostBlog.findByIdAndUpdate(id, req.body, {new: true}, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/posts/:id/delete', (req, res) => {
  let id = req.params.id;
  console.log(id);
  PostBlog.findByIdAndDelete(id, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/posts/:id/likes', (req, res) => {
  let id = req.params.id;
  PostBlog.findByIdAndUpdate(id, { $inc: { likes: 1}}, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/posts/:id', (req, res) => {
  let id = req.params.id;
  PostBlog.findById(id, (err, post) => {
    if (err) res.status(500).send(err);
    res.render('post', {post: post});
  })
})

router.post('/posts/:id/comment', (req, res) => {
  var newComment = new CommentPost(req.body);
  console.log(newComment);
  var id = req.params.id;

  newComment.save(err => {
    if (err) throw err;
    res.redirect(`/posts/${id}`);
  })
})

router.get('/posts/:id/comment', (req, res) => {
  CommentPost.find({}, (err, comments) => {
    console.log(comments);
    if (err) res.status(500).send(err);
    res.render('posts', {comments: comments});
  })
})

module.exports = router;

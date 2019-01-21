var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var PostBlog = mongoose.model('PostBlog');
var CommentPost = mongoose.model('CommentPost');
var isUser = require('./index');

/* GET users listing. */

router.post('/', (req, res) => {
  var newPost = new PostBlog(req.body);
  newPost.save(err => {
    if (err) throw err;
    res.redirect('/');
  })
})

router.get('/newPost', (req, res) => {
  res.render('newPost');
})

router.get('/:id/edit', isUser, (req, res) => {
  let id = req.params.id;
  PostBlog.findById(id, (err, post) => {
    if (err) res.status(500).send(err);
    res.render('editPost', {post: post})
  })
})

router.post('/:id', (req, res) => {
  let id = req.params.id;

  PostBlog.findByIdAndUpdate(id, req.body, {new: true}, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/:id/delete', isUser, (req, res) => {
  let id = req.params.id;
  PostBlog.findByIdAndDelete(id, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/:id/likes', isUser, (req, res) => {
  let id = req.params.id;
  PostBlog.findByIdAndUpdate(id, { $inc: { likes: 1}}, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/:slug', (req, res) => {
  let slug = req.params.slug;
  PostBlog.findOne({ 'slug': slug }, (err, post) => {
    if (err) res.status(500).send(err);

    PostBlog.findOne({'slug': slug}).populate('Comments').exec((err, comment) => {
      if (err) throw new Error('Comment not found');
      res.render('post', {post: post, comments: comment.Comments});
    })
  })
})

router.post('/:id/comment', (req, res) => {
  var newComment = new CommentPost(req.body);
  var id = req.params.id;
  newComment.save(err => {
    PostBlog.findByIdAndUpdate(id, { $push: { Comments: newComment.id } }, (err, data) => {
      if (err) throw err;
      res.redirect(`/posts/${data.slug}`);
    })
  })

  PostBlog.findById(id, (err, comment) => {
    if (err) throw err;
    let uniqComment = comment.Comments;
    uniqComment.push(newComment);
  })

})

router.get('/:id/comment/:id/edit', isUser, (req, res) => {
  let id = req.params.id;
  CommentPost.findById(id, (err, comment) => {
    if (err) throw new Error('Could not edit');
    res.render('editComment', {comment: comment});
  })
});

router.post('/:postId/comment/:id', (req, res) => {
  let id = req.params.id;
  CommentPost.findByIdAndUpdate({_id: id},  { $set: { description: req.body.description }}, {new: true},(err, comment) => {
    if (err) throw new Error('Could not edit comment');

    PostBlog.findById(comment.post, (err, comment) => {
      if (err) throw new Error('Comment could not be post.')
      res.redirect(`/posts/${comment.slug}`);
    })
  })
})

router.get('/:postId/comment/:id/delete', isUser, (req, res) => {
  let id = req.params.id;
  CommentPost.findByIdAndDelete(id, (err, comment) => {
    if (err) throw new Error('Could not delete the comment');

    PostBlog.findById(comment.post, (err, comment) => {
      if (err) throw new Error('Comment could not be post.')
      res.redirect(`/posts/${comment.slug}`);
    })
  })
})

module.exports = router;

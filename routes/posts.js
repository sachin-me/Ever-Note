var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var PostBlog = mongoose.model('PostBlog');
var CommentPost = mongoose.model('CommentPost');

/* GET users listing. */

router.post('/', (req, res) => {
  var newPost = new PostBlog(req.body);
  console.log(newPost);
  newPost.save(err => {
    if (err) throw err;
    res.redirect('/');
  })
})

router.get('/newPost', (req, res) => {
  res.render('newPost');
})

router.get('/:id/edit', (req, res) => {
  let id = req.params.id;
  PostBlog.findById(id, (err, post) => {
    console.log(post);
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

router.get('/:id/delete', (req, res) => {
  let id = req.params.id;
  console.log(id);
  PostBlog.findByIdAndDelete(id, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/:id/likes', (req, res) => {
  let id = req.params.id;
  PostBlog.findByIdAndUpdate(id, { $inc: { likes: 1}}, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/:id', (req, res) => {
  let id = req.params.id;
  PostBlog.findById(id, (err, post) => {
    if (err) res.status(500).send(err);
    // res.render('post', {post: post});
    PostBlog.findById(id).populate('Comments').exec((err, comment) => {
      console.log(comment, 'comments list');
      if (err) throw new Error('Comment not found');
      res.render('post', {post: post, comment: comment.Comments});
    })
  })
})

router.post('/:id/comment', (req, res) => {
  var newComment = new CommentPost(req.body);
  var id = req.params.id;

  newComment.save(err => {
    PostBlog.findByIdAndUpdate(id, { $push: { Comments: newComment.id } }, (err, data) => {
      if (err) throw err;
      res.redirect(`/posts/${id}`);
    })
  })

  PostBlog.findById(id, (err, comment) => {
    if (err) throw err;
    let uniqComment = comment.Comments;
    uniqComment.push(newComment);
    console.log(uniqComment);
  })

})

// router.get('/:id/comment', (req, res) => {
//   let id = req.params.id;
//   PostBlog.findById(id).populate('Comments').exec((err, data) => {
//     console.log(data);
//     if (err) throw new Error('Comment not found');
//     res.render('post', {comment: data});
//   })
// });


module.exports = router;

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');

var PostBlog = mongoose.model('PostBlog');
var CommentPost = mongoose.model('CommentPost');

var isUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    return next();

  }
  res.status(403).redirect('/login');
};


/* GET users listing. */

router.post('/', (req, res) => {
  var newPost = new PostBlog(req.body);
  newPost.save(err => {
    if (err) throw err;
    res.redirect('/');
  })
})

router.get('/newPost', isUser, (req, res) => {
  res.render('newPost');
})

router.get('/:id/edit', isUser, (req, res) => {

  let id = req.params.id;
  let userId = req.user._id;
  PostBlog.findById(id, (err, post) => {
    if (err) return res.status(500).send(err);
    if (JSON.stringify(userId) == JSON.stringify(post.author)) {
      res.render('editPost', {
        post: post,
        userId: userId
      })
    } else {
      res.redirect('/');
    }
  });

})

router.post('/:id', (req, res) => {
  let id = req.params.id;

  PostBlog.findByIdAndUpdate(id, req.body, {
    new: true
  }, (err, post) => {
    if (err) res.status(500).send(err);
    res.redirect('/');
  })
})

router.get('/:id/delete', isUser, (req, res) => {
  let id = req.params.id;
  let userId = req.user._id;

  PostBlog.findById(id, (err, post) => {
    if (err) throw err;
    if (JSON.stringify(userId) == JSON.stringify(post.author)) {
      PostBlog.findByIdAndRemove(id, (err, post) => {
        if (err) res.status(500).send(err);
        res.redirect('/');
      })
    } else {
      res.redirect('/');
    }
  })
})

router.get('/:id/likes', isUser, (req, res) => {
  let id = req.params.id;
  PostBlog.findById(id, (err, post) => {
    if (post.likes.users.indexOf(req.user._id) > -1) {
      PostBlog.findByIdAndUpdate(id, {
        $inc: {
          'likes.count': -1
        },
        $pull: {
          'likes.users': req.user._id
        }
      }, (err, post) => {
        if (err) res.status(500).send(err);
        res.redirect('/');
      });
    } else {
      PostBlog.findByIdAndUpdate(id, {
        $inc: {
          'likes.count': 1
        },
        $push: {
          'likes.users': req.user._id
        }
      }, (err, post) => {
        if (err) res.status(500).send(err);
        res.redirect('/');
      });
    }
  })

})

router.get('/:slug', (req, res) => {
  let slug = req.params.slug;
  let userId = req.user ? req.user._id : null;
  PostBlog.findOne({
    'slug': slug
  }, (err, post) => {
    if (err) res.status(500).send(err);

    PostBlog.findOne({
      'slug': slug
    }).populate('Comments').exec((err, comment) => {
      if (err) throw new Error('Comment not found');
      res.render('post', {
        post: post,
        comments: comment.Comments,
        userId: userId,
        user: req.user
      });
    })
  })
})

router.post('/:id/comment', isUser, (req, res) => {
  var newComment = new CommentPost(req.body);
  var id = req.params.id;
  newComment.save(err => {
    PostBlog.findByIdAndUpdate(id, {
      $push: {
        Comments: newComment.id
      }
    }, (err, data) => {
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
    res.render('editComment', {
      comment: comment
    });
  })
});

router.post('/:postId/comment/:id', (req, res) => {
  let id = req.params.id;
  CommentPost.findByIdAndUpdate({
    _id: id
  }, {
    $set: {
      description: req.body.description
    }
  }, {
    new: true
  }, (err, comment) => {
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
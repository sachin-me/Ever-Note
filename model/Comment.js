
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  description: String,
  post: {type: Schema.Types.ObjectId, ref: 'PostBlog'},
  author: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: {createdAt: 'created_at'}});

var CommentPost = mongoose.model('CommentPost', CommentSchema);

module.exports = CommentPost;
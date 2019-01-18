
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  description: String,
  post: {type: Schema.Types.ObjectId, ref: 'PostBlog'}
}, {timestamps: {createdAt: 'created_at'}});

var CommentPost = mongoose.model('CommentPost', CommentSchema);

module.exports = CommentPost;
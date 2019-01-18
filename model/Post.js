var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  description: String,
  tags: String,
  likes: { type: Number, default: 0},
  Comments: [{type: Schema.Types.ObjectId, ref: 'CommentPost'}]
}, { timestamps: {createdAt: 'created_at'}});

var PostBlog = mongoose.model('PostBlog', PostSchema);

module.exports = PostBlog;
var mongoose = require('mongoose');
var slug = require('slug');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  description: String,
  tags: String,
  likes: { 
    count: {
      type: Number,
      default: 0,
    },
    users: [{type: Schema.Types.ObjectId, ref: 'User'}] 
  },
  Comments: [{type: Schema.Types.ObjectId, ref: 'CommentPost'}],
  slug: String,
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
}, { timestamps: {createdAt: 'created_at'}});

PostSchema.pre("save", function(next) {
  this.slug = slug(this.title, { lower: true });
  next();
})

var PostBlog = mongoose.model('PostBlog', PostSchema);

module.exports = PostBlog;

// likes: {
//   count: {
//     type: Number,
//   },
//   users: [{}]
// }
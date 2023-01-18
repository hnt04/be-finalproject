const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
        content: {
        type: String,
        require: true,
        },
        image: {
        type: String,
        require: true,
        },
        author: { 
            type: mongoose.SchemaTypes.ObjectId, require: true, ref: "User" 
        },
        post: {
            type: mongoose.SchemaTypes.ObjectId, require: true, ref: "Post"
        },
        reaction: { like: 0 },
  },
  {
        timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

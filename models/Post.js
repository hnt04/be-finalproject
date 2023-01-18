const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
        content: {
        type: String,
        require: true,
        },
        image: {
        type: String,
        require: "",
        },
        author: { 
            type: mongoose.SchemaTypes.ObjectId, 
            required: true,
            ref: "User" 
        },
        // comments: {
        //   type: mongoose.SchemaTypes.ObjectId, 
        //     required: true,
        //     ref: "Comment" 
        //   },
        isDeleted: {
            type: Boolean,
            default:false,
            select: false
        },
        commentCount: { type: Number, default:0 },
        reaction: { like: { type: Number, default:0 }},
  },
  {
        timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

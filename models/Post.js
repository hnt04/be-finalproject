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
      ref: "User",
    },
    check: {
      type: Boolean,
      default: false,
      select: false,
    },
    // check: {
    //   type: String,
    //   enum: ["false", "true"],
    //   required: true,
    //   default: "false",
    // },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    commentCount: { type: Number, default: 0 },
    reaction: { heart: { type: Number, default: 0 } },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

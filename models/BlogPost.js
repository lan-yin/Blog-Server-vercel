import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    contentOne: {
      type: String,
      require: true,
    },
    contentTwo: {
      type: String,
    },
    author: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;

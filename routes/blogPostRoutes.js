import express from "express";
import BlogPost from "../models/BlogPost.js";
import protectRoute from "../middleware/authMiddleware.js";
import asyncHandler from "express-async-handler";

const blogPostRoutes = express.Router();

const getBlogPostByCategory = asyncHandler(async (req, res) => {
  const { category, pageNumber } = req.params;
  const posts = await BlogPost.find({});
  const increment = pageNumber + 4;
  let getStatus = () => (increment < posts.length ? 200 : 201); // 201 response means last chunk of blog posts

  if (category === "all") {
    res.header("Access-Control-Allow-Origin", "*").status(getStatus()).json(posts.slice(pageNumber, increment));
  } else if (category == "latest") {
    res
      .header("Access-Control-Allow-Origin", "*")
      .status(getStatus())
      .json(posts.sort((objA, objB) => Number(objB.createdAt) - Number(objA.createdAt)).slice(pageNumber, increment));
  } else {
    const blogPosts = await BlogPost.find({ category });
    res.header("Access-Control-Allow-Origin", "*").status(getStatus()).json(blogPosts.slice(pageNumber, increment));
  }
});

const getBlogPost = asyncHandler(async (req, res) => {
  const blogPost = await BlogPost.findById(req.params.id);
  if (blogPost) {
    res.header("Access-Control-Allow-Origin", "*").json(blogPost);
  } else {
    res.status(404).send("Blog Post not found.");
  }
});

const createBlogPost = asyncHandler(async (req, res) => {
  // We don't get the author from the front end, becuz our web app just for one author.
  // However if have multiple admins, you have past this author with input in front end.
  // And need to keep track these authors.
  const { image, title, contentOne, contentTwo, category, author = "Lenzo" } = req.body;

  const newBlogPost = await BlogPost.create({
    image,
    title,
    contentOne,
    contentTwo,
    category: String(category).toLowerCase(),
    author,
  });
  await newBlogPost.save();
  const blogPosts = await BlogPost.find({});
  if (newBlogPost) {
    res.header("Access-Control-Allow-Origin", "*").json(blogPosts);
  } else {
    res.status(404).send("Blog post could not be stored.");
  }
});

const updateBlogPost = asyncHandler(async (req, res) => {
  const { _id, title, contentOne, contentTwo, category, image } = req.body;

  const blogPost = await BlogPost.findById(_id);

  if (blogPost) {
    blogPost.title = title;
    blogPost.category = category;
    blogPost.contentOne = contentOne;
    blogPost.contentTwo = contentTwo;
    blogPost.image = image;
    await blogPost.save();

    const blogPosts = await BlogPost.find({});
    res.json(blogPosts);
  } else {
    res.status(404).send("Blog post could not be updated.");
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const blogPost = await BlogPost.findByIdAndDelete(req.params.id);

  const allBlogPosts = await BlogPost.find({});

  if (allBlogPosts) {
    res.header("Access-Control-Allow-Origin", "*").json(allBlogPosts);
  } else {
    res.status(404).send("Blog post could not be removed.");
  }
});

blogPostRoutes.route("/").post(protectRoute, createBlogPost);
blogPostRoutes.route("/post/:id").get(getBlogPost);
blogPostRoutes.route("/:id").delete(protectRoute, deletePost);
blogPostRoutes.route("/").put(protectRoute, updateBlogPost);
blogPostRoutes.route("/:category/:pageNumber").get(getBlogPostByCategory);

export default blogPostRoutes;

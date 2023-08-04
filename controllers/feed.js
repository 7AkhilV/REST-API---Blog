const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const io = require("../socket"); // Importing the socket.io instance to emit real-time updates to clients.
const Post = require("../models/post");
const User = require("../models/user");

// Controller function to get paginated posts
exports.getPosts = async (req, res, next) => {
  // Extract the current page from the query parameters (default to 1 if not provided).
  const currentPage = req.query.page || 1;
  // Number of posts to display per page.
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments(); // Count the total number of posts in the database.
    const posts = await Post.find()
      .populate("creator", "name")
      .sort({ createdAt: -1 }) // Sort the posts in descending order based on their creation time.
      .skip((currentPage - 1) * perPage) // Skip the required number of posts based on the current page.
      .limit(perPage);

    res.status(200).json({
      message: "Fetched posts successfully.",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller function to create a new post.
exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    io.getIO().emit("posts", {
      // Emit a real-time update to connected clients.
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } }, // Send the created post with the creator's ID and name.
    });
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller function to get a single post by its ID.
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Post fetched.", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller function to update a post.
exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }
  try {
    // Find the post in the database and populate the "creator" field with the associated user data.
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      // Check if the authenticated user is the creator of the post
      const error = new Error("Not authorized!");
      error.statusCode = 403; // Set the status code to 403 (Forbidden).
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    // Update the post
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    io.getIO().emit("posts", { action: "update", post: result });
    res.status(200).json({ message: "Post updated!", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller function to delete a post.
exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    if (!post.creator || typeof post.creator.toString !== "function") {
      // Check if post.creator is undefined or does not have a toString method
      const error = new Error("Invalid post creator!");
      error.statusCode = 500; // You can set an appropriate status code here
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    // Check logged in user
    clearImage(post.imageUrl); // Remove the associated image file from the server.
    await Post.findByIdAndRemove(postId); // Delete the post from the database.

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    io.getIO().emit("posts", { action: "delete", post: postId });
    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Function to clear the image file from the server.
const clearImage = (filePath) => {
  // Construct the absolute file path on the server.
  filePath = path.join(__dirname, "..", filePath);
  // Delete the file from the server.
  fs.unlink(filePath, (err) => console.log(err));
};

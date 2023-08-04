const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /feed/posts => Route to get all posts.
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post => // Route to create a new post.
router.post(
  "/post",
  isAuth,
  [
    // Request data validation using express-validator.
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

// Route to get a single post by its ID.
router.get("/post/:postId", isAuth, feedController.getPost);

// Route to update a post by its ID.
router.put(
  "/post/:postId",
  isAuth,
  [
    // Request data validation using express-validator.
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

// Route to delete a post by its ID.
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;

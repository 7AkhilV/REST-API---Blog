const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// Route for user signup.
router.put(
  "/signup",
  [
    // Request data validation using express-validator.
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // Custom validation to check if the email already exists in the database
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(), // Normalize the email to lowercase.
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

// Route for user login.
router.post("/login", authController.login);

// Route to get user status (requires authentication).
router.get("/status", isAuth, authController.getUserStatus);

// Route to update user status (requires authentication).
router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

module.exports = router;

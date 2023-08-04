const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware function to check for a valid JWT and extract the user ID.
module.exports = (req, res, next) => {
  // Get the "Authorization" header from the request.
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  // Extract the token from the "Authorization" header (Bearer token format).
  const token = authHeader.split(" ")[1];

  // Declare a variable to store the decoded token.
  let decodedToken;

  try {
    // Verify the token using the secret key.
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    // If the token is invalid or not provided.
    const error = new Error("Not authenticated.");
    error.statusCode = 401; // Set the status code to 401 (Unauthorized).
    throw error;
  }
  // Set the authenticated user's ID in the "req" object for future use in route handlers
  req.userId = decodedToken.userId;
  next();
};

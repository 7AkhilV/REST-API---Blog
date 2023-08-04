const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

dotenv.config();

const fileStorage = multer.diskStorage({
  // Configuring multer for file storage.
  destination: (req, file, cb) => {
    // The destination folder where uploaded images will be stored
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // The filename format for uploaded images.
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Configuring multer for file filtering based on file type (mimetype).
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    // Allow image files with specified mimetypes.
    cb(null, true);
  } else {
    // Reject other file types.
    cb(null, false);
  }
};

// Configuring middleware to parse incoming JSON data.
app.use(bodyParser.json()); // application/json

// Configuring multer to handle file uploads.
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Configuring static file serving for images.
app.use("/images", express.static(path.join(__dirname, "images")));

// Configuring CORS headers.
app.use((req, res, next) => {
  // Allowing all origins to access the server
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Allowing specific HTTP methods.
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );

  // Allowing specific headers.
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Configuring routes for feed and authentication.
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// Error handling middleware.
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// Connect to MongoDB and start the server.
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.w5b2eln.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require("./socket").init(server); // Initialize Socket.IO.
    io.on("connection", (socket) => {
      // Log when a client connects to the WebSocket server.
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));

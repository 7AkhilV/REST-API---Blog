const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the "userSchema" using the Schema class.
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new!", // The "status" field is of type String with a default value 'I am new!'
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post", // The "posts" field is an array of references to "Post" model documents in the database.
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

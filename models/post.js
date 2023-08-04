const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the "postSchema" using the Schema class.
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User', // The "creator" field is a reference to a "User" model in the database.
      required: true
    }
  },
  { timestamps: true } // The "timestamps" option will automatically add "createdAt" and "updatedAt" fields to the document.
);

module.exports = mongoose.model('Post', postSchema);
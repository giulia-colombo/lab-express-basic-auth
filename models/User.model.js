const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, //always converts a text to lowercase before saving
    trim: true //always removes leading+trailing whitespace
  },
  passwordHash: {
    type: String,
    required: true
  }
});

const User = model("User", userSchema); //defining a User model

module.exports = User;

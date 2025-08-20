const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);

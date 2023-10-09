const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateAccessToken } = require("../routes/auth/authController");

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Deirive time from date
adminSchema.virtual("type").get(function () {
  return "ADMIN";
});

const adminModel = mongoose.model("Administrator", adminSchema);
module.exports = adminModel;

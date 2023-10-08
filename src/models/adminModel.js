const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateAccessToken } = require("../routes/authController");

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

const adminModel = mongoose.model("Administrator", adminSchema);
module.exports = adminModel;

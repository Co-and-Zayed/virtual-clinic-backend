const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
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

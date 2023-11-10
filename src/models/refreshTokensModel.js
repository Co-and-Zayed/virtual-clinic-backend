const mongoose = require("mongoose");
require("dotenv").config();
const Schema = mongoose.Schema;

const refreshTokensSchema = new Schema({
  username: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expire_at: {
    type: Date,
    default: Date.now,
    expires: 86400, // 1 day
  },
});

const refreshTokensModel = mongoose.model("RefreshTokens", refreshTokensSchema);
module.exports = refreshTokensModel;

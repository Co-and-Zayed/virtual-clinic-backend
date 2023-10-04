const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokensSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const refreshTokensModel = mongoose.model("RefreshTokens", refreshTokensSchema);
module.exports = refreshTokensModel;

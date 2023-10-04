require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const refreshTokensModel = require("../models/refreshTokensModel");

app.use(express.json());

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

// created using user = { email: string, issuedAt: Date }
async function createUserTokens(user) {
  // Authenticate User
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  // TODO: add refresh token to database
  try {
    const refreshTokenToAdd = new refreshTokensModel({
      email: user.email,
      token: refreshToken,
    });
    await refreshTokenToAdd.save();
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (err) {
    return { message: err.message };
  }
}

async function handleRefreshToken(req, res) {
  const { email, token } = req.body;
  if (token == null) return res.sendStatus(401);

  // TODO: find in database
  const tokenRecord = await refreshTokensModel.findOne({ email });
  if (!tokenRecord || tokenRecord.token !== token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      email: user.email,
      issuedAt: new Date(),
    });
    res.json({ accessToken: accessToken });
  });
}

async function deleteRefreshToken(req, res) {
  const { email } = req.body;
  // TODO: remove from database
  try {
    // Find and delete the token associated with the provided email
    const deletedToken = await refreshTokensModel.findOneAndDelete({ email });
    if (deletedToken) {
      res.status(200).json({ message: "Token deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: "Token not found for the specified email" });
    }
  } catch (error) {
    console.error("Error deleting token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createUserTokens,
  handleRefreshToken,
  deleteRefreshToken,
};

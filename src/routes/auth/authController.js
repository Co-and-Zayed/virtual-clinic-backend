require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const refreshTokensModel = require("../../models/refreshTokensModel");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
}

// Creates a new access token and refresh token for the user
async function createUserTokens(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  // Add refresh token to database
  try {
    const refreshTokenToAdd = new refreshTokensModel({
      username: user.username,
      type: user.type,
      token: refreshToken,
    });
    await refreshTokenToAdd.save();
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (err) {
    return { message: err.message };
  }
}

// Creates a new access token for the user for a valid refresh token
async function handleRefreshToken(req, res) {
  const { username, email, token } = req.body;
  if (token == null) return res.sendStatus(401);

  // Find in database
  const tokenRecord = await refreshTokensModel.findOne({ username });
  if (!tokenRecord || tokenRecord.token !== token) {
    // MIGHT BE ADMIN
    const adminTokenRecord = await refreshTokensModel.findOne({ username });
    if (!adminTokenRecord || adminTokenRecord.token !== token) {
      return res.sendStatus(403);
    }
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      username: user.username,
      type: user.type,
      issuedAt: new Date(),
    });
    res.json({ accessToken: accessToken });
  });
}

// Deletes the refresh token associated with the provided email
async function deleteRefreshToken(req, res) {
  const { email } = req.body;

  // Remove from database
  try {
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

// Middleware to authenticate the access token
function authenticateToken(userType) {
  return async (req, res, next) => {
    const { email } = req.body;
    const tokenRecord = await refreshTokensModel.findOne({ email });
    if (!tokenRecord) return res.sendStatus(401);

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err);
      if (err)
        return res.status(403).json({ message: "Access Token is not valid" }); // should send a refresh request
      if (user.type !== userType)
        return res.status(403).json({ message: "User is not authorized" });
      req.user = user;
      next();
    });
  };
}

module.exports = {
  createUserTokens,
  handleRefreshToken,
  deleteRefreshToken,
  authenticateToken,
  generateAccessToken,
};

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
  // res.json({ message: "Token deleted successfully" });
  const { username } = req.body;
  // Remove from database
  try {
    const deletedToken = await refreshTokensModel.findOneAndDelete({
      username,
    });
    if (deletedToken) {
      res.status(200).json({ message: "Token deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: "Token not found for the specified username" });
    }
  } catch (error) {
    console.error("Error deleting token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Middleware to authenticate the access token
function authenticateToken(userType) {
  return async (req, res, next) => {
    const { refreshToken } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res
        .status(401)
        .json({ message: "Authorization header token not found" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        await refreshTokensModel.deleteMany({ token: refreshToken });
        return res.status(401).json({ message: "Access Token is not valid" }); // should send a refresh request
      }

      const tokenRecord = await refreshTokensModel.findOne({
        username: user.username,
      });
      if (!tokenRecord) {
        await refreshTokensModel.deleteMany({ token: refreshToken });
        return res.status(401).json({ message: "No refresh token found" });
      }
      if (user.type !== userType) {
        await refreshTokensModel.deleteMany({ token: refreshToken });
        return res
          .status(401)
          .json({ message: "User is not authorized", userType: user.type, input: userType });
      }
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

require("dotenv").config({
  path: "../.env",
});
const express = require("express");
const jwt = require("jsonwebtoken");
const refreshTokensModel = require("../../models/refreshTokensModel");

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}

// Creates a new access token and refresh token for the user
async function createUserTokens(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1440m",
  });

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
  const tokenRecord = await refreshTokensModel.findOne({ token });
  if (!tokenRecord || tokenRecord.token !== token) {
    console.log("TOKEN NOT FOUND FOR USER: ", username);
    return res
      .status(401)
      .json({ message: "Refresh Token not found for user: " + username });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) {
      await refreshTokensModel.deleteMany({ token: token });
      return res.status(401).json({ message: "Refresh Token has expired" });
    }

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
  const { refreshToken } = req.body;
  // Remove from database
  try {
    const deletedToken = await refreshTokensModel.findOneAndDelete({
      token: refreshToken,
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
function authenticateToken(userType = null) {
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

      // verify the refresh token is valid has not expired
      jwt.verify(
        tokenRecord.token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            await refreshTokensModel.deleteMany({ token: refreshToken });
            return res
              .status(401)
              .json({ message: "Refresh Token has expired" });
          }
        }
      );

      if (userType && user.type !== userType) {
        await refreshTokensModel.deleteMany({ token: refreshToken });
        return res.status(401).json({
          message: "User is not authorized",
          userType: user.type,
          input: userType,
        });
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

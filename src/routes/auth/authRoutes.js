const express = require("express");
const router = express.Router();
const refreshTokensModel = require("../../models/refreshTokensModel");
const {
  handleRefreshToken,
  deleteRefreshToken,
  authenticateToken,
} = require("./authController");

// POST: Creates a new access token and refresh token for the user
router.post("/regenerateToken", handleRefreshToken);

// POST: Deletes corresponding refresh token from database on logout
router.delete("/logout", deleteRefreshToken);

router.get("/allRefreshTokens", async (req, res) => {
  const tokens = await refreshTokensModel.find();
  res.json(tokens);
});

/*****  TEST ROUTES *****/

// GET: Testing JWT authentication (for testing purposes)
router.post("/testingToken", authenticateToken, (req, res) => {
  res.json({ message: "Token is valid" });
});

// GET: Delete all refresh tokens
router.get("/deleteRefreshTokens", async (req, res) => {
  const tokens = await refreshTokensModel.deleteMany({});
  res.json(tokens);
});

module.exports = router;

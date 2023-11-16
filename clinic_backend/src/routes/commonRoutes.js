const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../../routes/auth/authController");
const { getPackages } = require("./package/packageController");

router.get("/getPackages", authenticateToken(), getPackages);

module.exports = router;

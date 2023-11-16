const express = require("express");
const router = express.Router();

const { createSale } = require("./salesController");
const { authenticateToken } = require("../../../../routes/auth/authController");

// Sales Routes
router.post("/createSale", createSale);

module.exports = router;

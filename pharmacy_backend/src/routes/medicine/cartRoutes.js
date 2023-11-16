const express = require("express");
const router = express.Router();

const { getCart, updateCart } = require("./cartController");
const { authenticateToken } = require("../../../../routes/auth/authController");

// Medicine Routes
router.get("/getCart", authenticateToken("PATIENT"), getCart);
router.put("/updateCart", authenticateToken("PATIENT"), updateCart);

module.exports = router;

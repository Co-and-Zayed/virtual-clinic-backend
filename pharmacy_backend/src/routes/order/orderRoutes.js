const express = require("express");
const router = express.Router();

const { getOrders, cancelOrder } = require("./orderController");
const { authenticateToken } = require("../../../../routes/auth/authController");

router.get("/getOrders", authenticateToken("PATIENT"), getOrders);
router.patch("/cancelOrder/:id", authenticateToken("PATIENT"), cancelOrder);

module.exports = router;

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../../../../routes/auth/authController");
const { resetPassword } = require("./patientController");

router.post("/resetPassword", authenticateToken("PATIENT"), resetPassword);

module.exports = router;

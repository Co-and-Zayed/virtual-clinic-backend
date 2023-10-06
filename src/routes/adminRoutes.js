const express = require("express");
const router = express.Router();
const adminModel = require("../models/adminModel");
const {
  createPackage,
  deletePackage,
  updatePackage,
} = require("./packageController");
const {
  loginAdmin,
  createAdmin,
  deletePatient,
  deleteDoctor,
  deleteAdmin,
} = require("./adminController");

// POST: Creates a new access token and refresh token for the user
router.post("/loginAdmin", loginAdmin);
router.post("/createAdmin", createAdmin);
router.post("/deletePatient", deletePatient);
router.post("/deleteDoctor", deleteDoctor);
router.post("/deleteAdmin", deleteAdmin);
router.get("/viewAllAdmins", async (req, res) => {
  const admins = await adminModel.find();
  res.json(admins);
});

router.post("/createPackage", createPackage);
router.post("/deletePackage", deletePackage);
router.post("/updatePackage", updatePackage);

module.exports = router;

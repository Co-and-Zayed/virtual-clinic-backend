const express = require("express");
const router = express.Router();
const adminModel = require("../models/adminModel");
const {
  createPackage,
  deletePackage,
  updatePackage,
  getPackages,
} = require("./packageController");
const {
  loginAdmin,
  createAdmin,
  deletePatient,
  deleteDoctor,
  deleteAdmin,
  viewDoctors,
  viewPatients,
} = require("./adminController");

// POST: Creates a new access token and refresh token for the user
router.post("/loginAdmin", loginAdmin);
router.post("/createAdmin", createAdmin);
router.post("/deletePatient", deletePatient);
router.post("/deleteDoctor", deleteDoctor);
router.post("/deleteAdmin", deleteAdmin);
router.get("/viewAllAdmins/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Find all admins except the one with the specified ID
    const admins = await adminModel.find({ _id: { $ne: id } });

    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getPackages", getPackages);
router.post("/createPackage", createPackage);
router.post("/deletePackage/:id", deletePackage);
router.post("/updatePackage/:id", updatePackage);

router.get("/viewDoctors", viewDoctors);
router.get("/viewPatients", viewPatients);

module.exports = router;

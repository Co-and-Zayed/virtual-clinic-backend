const express = require("express");
const router = express.Router();
const adminModel = require("../../models/adminModel");
const { authenticateToken } = require("../auth/authController");
const {
  createPackage,
  deletePackage,
  updatePackage,
  getPackages,
} = require("../package/packageController");
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
router.post("/loginAdmin", authenticateToken("ADMIN"), loginAdmin);
router.post("/createAdmin", authenticateToken("ADMIN"), createAdmin);
router.post("/deletePatient", authenticateToken("ADMIN"), deletePatient);
router.post("/deleteDoctor", authenticateToken("ADMIN"), deleteDoctor);
router.post("/deleteAdmin", authenticateToken("ADMIN"), deleteAdmin);
router.get(
  "/viewAllAdmins/:id",
  authenticateToken("ADMIN"),
  async (req, res) => {
    const { id } = req.params;
    try {
      // Find all admins except the one with the specified ID
      const admins = await adminModel.find({ _id: { $ne: id } });

      res.json(admins);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/createPackage", authenticateToken("ADMIN"), createPackage);
router.post("/deletePackage/:id", authenticateToken("ADMIN"), deletePackage);
router.post("/updatePackage/:id", authenticateToken("ADMIN"), updatePackage);

router.get("/viewDoctors", authenticateToken("ADMIN"), viewDoctors);
router.get("/viewPatients", authenticateToken("ADMIN"), viewPatients);

module.exports = router;

const express = require("express");
const router = express.Router();
const adminModel = require("../../../../models/adminModel");
const { authenticateToken } = require("../../../../routes/auth/authController");

const {
  loginAdmin,
  createAdmin,
  deletePatient,
  deletePharmacist,
  deleteAdmin,
  viewPharmacists,
  viewPatients,
  acceptPharmacist,
  rejectPharmacist,
  sendContract,
} = require("./adminController");

// POST: Creates a new access token and refresh token for the user
router.post("/loginAdmin", authenticateToken("ADMIN"), loginAdmin);
router.post("/createAdmin", createAdmin);
router.post("/deletePatient", authenticateToken("ADMIN"), deletePatient);
router.post("/deletePharmacist", authenticateToken("ADMIN"), deletePharmacist);
router.post("/deleteAdmin", authenticateToken("ADMIN"), deleteAdmin);
router.put("/acceptPharmacist", authenticateToken("ADMIN"), acceptPharmacist);
router.put("/rejectPharmacist", authenticateToken("ADMIN"), rejectPharmacist);
router.post("/sendContract", authenticateToken("ADMIN"), sendContract);
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

router.get("/viewPharmacists", authenticateToken("ADMIN"), viewPharmacists);
router.get("/viewPatients", authenticateToken("ADMIN"), viewPatients);

module.exports = router;

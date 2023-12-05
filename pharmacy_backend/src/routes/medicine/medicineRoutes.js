const express = require("express");
const router = express.Router();
const { uploadS3 } = require("../../../../utils/uploadMultipleFiles");

const {
  createMedicine,
  getMedicines,
  filterMedicines,
  getMedicinalUses,
  editMedicine,
  updateMedicineImage,
  deleteMedicine,
  getMedicineById,
  buyMedicines,
} = require("./medicineController");
const { authenticateToken } = require("../../../../routes/auth/authController");

// Medicine Routes
router.get("/getMedicines", authenticateToken(), getMedicines);

router.post(
  "/createMedicine",
  authenticateToken("PHARMACIST"),
  uploadS3.array("files", 20),
  createMedicine
);

router.post(
  "/editMedicine/:id",
  authenticateToken("PHARMACIST"),
  uploadS3.array("files", 20),
  editMedicine
);

router.post(
  "/updateMedicineImage/:id",
  uploadS3.array("files", 20),
  updateMedicineImage
);
router.post("/filterMedicines", filterMedicines);
router.get("/getMedicinalUses", getMedicinalUses);
router.get("/getMedicineById/:id", getMedicineById);
router.post("/buyMedicines", authenticateToken("PATIENT"), buyMedicines);

module.exports = router;

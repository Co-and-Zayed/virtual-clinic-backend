const express = require("express");
const router = express.Router();

const {
  getAllPrescriptions,
  getSinglePrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
} = require("./prescriptionsController");

router.get("/", getAllPrescriptions);
router.get("/:id", getSinglePrescription);
router.post("/", createPrescription);
router.patch("/:id", updatePrescription);
router.delete("/:id", deletePrescription);

module.exports = router;

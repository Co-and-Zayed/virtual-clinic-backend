const express = require("express");
const router = express.Router();

const {
  getAllPrescriptions,
  getSinglePrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
} = require("./prescriptionsController");

router.post("/getPrescriptions", getAllPrescriptions);
router.get("/getPrescription/:id", getSinglePrescription);
router.post("/createPrescription", createPrescription);
router.patch("/updatePrescription/:id", updatePrescription);
router.delete("/deletePrescription/:id", deletePrescription);

module.exports = router;

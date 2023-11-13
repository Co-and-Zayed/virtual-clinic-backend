const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../auth/authController");
const {
  getPatientInfo,
  getPatients,
  getPatientsByName,
  getUpcomingAptmnts,
  editSettings,
  viewSettings,
  viewAllContracts,
  acceptContract,
  rejectContract,
} = require("./doctorController");
const { getAppointments } = require("../appointment/appointmentController");

//get a patient's information and health records given patient ID
router.post("/getPatientInfo", authenticateToken("DOCTOR"), getPatientInfo);

//get list of all patients given doctor's email
router.post("/getPatients", authenticateToken("DOCTOR"), getPatients);

//GET patients by searching name find({name : req.body.name})
router.get(
  "/getPatientsByName",
  authenticateToken("DOCTOR"),
  getPatientsByName
);

//GET patients based on upcomimg appointments
router.post(
  "/getUpcomingAptmnts",
  authenticateToken("DOCTOR"),
  getUpcomingAptmnts
);

router.post("/viewSettings", authenticateToken("DOCTOR"), viewSettings);

//PATCH email, hourly rate, affiliation
router.patch("/editSettings", authenticateToken("DOCTOR"), editSettings);

router.get("/getAppointments/",authenticateToken("DOCTOR"), getAppointments);

// After regestration accept or reject contract
router.get("/viewAllContracts", authenticateToken("DOCTOR"), viewAllContracts);

router.put("/acceptContract", authenticateToken("DOCTOR"), acceptContract);

router.put("/rejectContract", authenticateToken("DOCTOR"), rejectContract);

module.exports = router;

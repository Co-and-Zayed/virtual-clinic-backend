const express = require("express");
const router = express.Router();

const { getDoctors, getDoctordetails } = require("./patientController");
const { authenticateToken } = require("../auth/authController");

/////////////
// MOSTAFA //
/////////////
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require("../appointment/appointmentController");

const {
  addFamilyMember,
  getFamilyMembers,
} = require("./familyMemberController");

//GET list of all doctors or doctors by searching name and/or speciality
router.post("/getDoctors", authenticateToken("PATIENT"), getDoctors);
// Appointment Routes
router.post(
  "/createAppointment",
  authenticateToken("PATIENT"),
  createAppointment
);
router.post(
  "/getAppointments/:userType",
  authenticateToken("PATIENT"),
  getAppointments
);
router.put(
  "/updateAppointment/:id",
  authenticateToken("PATIENT"),
  updateAppointment
);
router.delete(
  "/deleteAppointment/:id",
  authenticateToken("PATIENT"),
  deleteAppointment
);

// Family Member Routes
router.post("/addFamilyMember", authenticateToken("PATIENT"), addFamilyMember);
router.post(
  "/getFamilyMembers",
  authenticateToken("PATIENT"),
  getFamilyMembers
);

///////////
// ZEINA //
///////////
router.post(
  "/getDoctordetails",
  authenticateToken("PATIENT"),
  getDoctordetails
);

module.exports = router;

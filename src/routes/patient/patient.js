const express = require("express");
const router = express.Router();

const { getDoctors, getDoctordetails, filterDoctors, payWithWallet,changepassword } = require("./patientController");
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

//POST filter doctors by speciality and/or availability on a specific date and time
router.post("/filterDoctors", authenticateToken("PATIENT"), filterDoctors);

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

router.post("/payWithWallet", authenticateToken("PATIENT"), payWithWallet);

///////////
// ZEINA //
///////////
router.post(
  "/getDoctordetails",
  authenticateToken("PATIENT"),
  getDoctordetails
);
router.patch(
  "/changepassword",
  authenticateToken("PATIENT"),
  changepassword
);



module.exports = router;

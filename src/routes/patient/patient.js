const express = require("express");
const router = express.Router();

const { getDoctors, getDoctordetails, filterDoctors,getHealthPackages,subscribeToPackage,viewPackages,getPackagePrice, subscribeToPackageForGuest, subscribeToPackageForFamilyPatient} = require("./patientController");
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
router.post("/addFamilyMember", 
// authenticateToken("PATIENT"),
 addFamilyMember);

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
router.get(
  "/getHealthPackages",
  //authenticateToken("PATIENT"),
  getHealthPackages
);
router.post(
  "/subscribeToPackage",
  //authenticateToken("PATIENT"),
  subscribeToPackage
);
router.post(
  "/viewPackages",
  //authenticateToken("PATIENT"),
  viewPackages
);
router.post(
  "/getPackagePrice",
  //authenticateToken("PATIENT"),
  getPackagePrice
);
router.post(
  "/subscribeToPackageForGuest",
  //authenticateToken("PATIENT"),
  subscribeToPackageForGuest
);
router.post(
  "/subscribeToPackageForFamilyPatient",
  //authenticateToken("PATIENT"),
  subscribeToPackageForFamilyPatient
);
module.exports = router;

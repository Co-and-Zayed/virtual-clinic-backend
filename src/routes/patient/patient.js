const express = require("express");
const router = express.Router();
const { uploadS3 } = require("../../utils/uploadMultipleFiles");

const {
  getDoctors,
  getDoctordetails,
  filterDoctors,
  getHealthPackages,
  subscribeToPackage,
  viewPackages,
  getPackagePrice,
  subscribeToPackageForGuest,
  subscribeToPackageForFamilyPatient,
  viewSubscribedPackage,
  viewSubscribedPackageforFamilyMember,
  unsubscribeFromPackage,
  unsubscribeFromPackageforFamily,
  payWithWallet,
  updateMedicalHistory,
  resetPassword,
} = require("./patientController");

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
router.post("/createAppointment", authenticateToken(), createAppointment);

router.get("/getAppointments", authenticateToken("PATIENT"), getAppointments);

router.put("/updateAppointment/:id", authenticateToken(), updateAppointment);

router.delete(
  "/deleteAppointment/:id",
  authenticateToken("PATIENT"),
  deleteAppointment
);

// Family Member Routes
router.post("/addFamilyMember", authenticateToken("PATIENT"), addFamilyMember);

router.get("/getFamilyMembers", authenticateToken("PATIENT"), getFamilyMembers);

router.post("/payWithWallet", authenticateToken("PATIENT"), payWithWallet);

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
  authenticateToken("PATIENT"),
  getHealthPackages
);
router.post(
  "/subscribeToPackage",
  //authenticateToken("PATIENT"),
  subscribeToPackage
);
router.post("/viewPackages", authenticateToken("PATIENT"), viewPackages);
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
  authenticateToken("PATIENT"),
  subscribeToPackageForFamilyPatient
);
router.post(
  "/viewSubscribedPackage",
  authenticateToken("PATIENT"),
  viewSubscribedPackage
);
router.post(
  "/viewSubscribedPackageforFamilyMember",
  authenticateToken("PATIENT"),
  viewSubscribedPackageforFamilyMember
);
router.post(
  "/unsubscribeFromPackage",
  authenticateToken("PATIENT"),
  unsubscribeFromPackage
);
router.post(
  "/unsubscribeFromPackageforFamily",
  authenticateToken("PATIENT"),
  unsubscribeFromPackageforFamily
);

router.post(
  "/updateMedicalHistory",
  authenticateToken("PATIENT"),
  uploadS3.array("files", 20),
  updateMedicalHistory
);

// Reset Password
router.post("/resetPassword", authenticateToken("PATIENT"), resetPassword);

module.exports = router;

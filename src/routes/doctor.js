const express = require("express");
const router = express.Router();

const {
  getPatientInfo,
  getPatients,
  getPatientsByName,
  getUpcomingAptmnts,
  editSettings,
} = require("./doctorController");

//get a patient's information and health records given patient ID
router.post("/getPatientInfo", getPatientInfo);

//get list of all patients given doctor's email
router.post("/getPatients", getPatients);


//GET patients by searching name find({name : req.body.name})
router.get("/getPatientsByName", getPatientsByName);

//GET patients based on upcomimg appointments
router.post("/getUpcomingAptmnts", getUpcomingAptmnts);

router.post("/viewSettings", viewSettings);

//PATCH email, hourly rate, affiliation
router.patch("/editSettings", editSettings);


module.exports = router;

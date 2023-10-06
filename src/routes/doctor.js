const express = require("express");
const router = express.Router();

const { getPatientInfo, getPatients, getPatientsByName, getUpcomingAptmnts, editSettings } = require('./doctorController')

//get a patient's information and health records given patient ID
router.post("/getPatientInfo", getPatientInfo);

//get list of all patients given doctor's email
router.post("/getPatients", getPatients);

//get patients by searching name 
router.post("/getPatientsByName", getPatientsByName);

//GET patients based on upcomimg appointments
router.post("/getUpcomingAptmnts", getUpcomingAptmnts);

//PATCH email, hourly rate, affiliation

router.patch('/editSettings', editSettings);

module.exports = router

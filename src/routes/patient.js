const express = require("express");
const router = express.Router();

const{ getDoctordetails}=require('./patientController')
router.post("/getDoctordetails",getDoctordetails)
module.exports = router
const express = require("express")
const router = express.Router()

const { getDoctors, getDoctorsByNameSpeciality } = require('./patientController')

//GET list of all doctors 
router.get('/getDoctors' , getDoctors)

//GET doctors by searching name and/or specialty
router.get('/getDoctorsByNameSpeciality' , getDoctorsByNameSpeciality)

module.exports = router



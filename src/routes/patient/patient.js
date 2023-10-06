const express = require("express")
const router = express.Router()

const { getDoctors, getDoctorsByNameSpecialty } = require('./patientController')

//GET list of all doctors 
router.get('/getDoctors' , getDoctors)

//GET doctors by searching name and/or specialty
router.get('/getDoctorsByNameSpecialty' , getDoctorsByNameSpecialty)

module.exports = router



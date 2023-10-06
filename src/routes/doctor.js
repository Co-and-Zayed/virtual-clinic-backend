const express = require("express")
const router = express.Router()

//GET a patient's information and health records
router.get('/getPatientInfo' , getPatientInfo)

//GET list of all patients 
router.get('/getPatients' , getPatients)

//GET patients by searching name find({name : req.body.name})
router.get('/getPatientsByName' , getPatientByName)

//GET patients based on upcomimg appointments 
router.get('/getUpcomingAptmnts' , getUpcomingAptmnts)

//PATCH email, hourly rate, affiliation
router.patch('/editSettings', editSettings)



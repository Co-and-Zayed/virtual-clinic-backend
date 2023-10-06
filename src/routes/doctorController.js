const Doctor = require('../models/doctorModel')

//GET a patient's information and health records
const getPatientInfo = async (req, res) => {}



//GET list of all patients 
const getPatients = async (req, res) => {}




//GET patients by searching name find({name : req.body.name})
const getPatientsByName = async (req, res) => {}



//GET patients based on upcomimg appointments
const getUpcomingAptmnts = async (req, res) => {} 
// request body: _id doctor
// today's date


// array appointments.find({status: upcoming, doctor, },{patient} )

// array.foreach patient.find({})
//     patient

// res . status . json(patients)



//PATCH email, hourly rate, affiliation
const editSettings = async (req, res) => {}

module.exports = { getPatientInfo, getPatients, getPatientsByName, getUpcomingAptmnts, editSettings }
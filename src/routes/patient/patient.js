const express = require("express")
const router = express.Router()

const { getDoctors, getDoctorsByNameSpeciality, getDoctordetails } = require('./patientController')

//GET list of all doctors 
router.get('/getDoctors' , getDoctors)

//GET doctors by searching name and/or specialty
router.get('/getDoctorsByNameSpeciality' , getDoctorsByNameSpeciality)

/////////////
// MOSTAFA //
/////////////
const {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment,
} = require("../appointmentController")

const{
    addFamilyMember,
    getFamilyMembers,
} = require("../familyMemberController");

// Appointment Routes
router.post("/createAppointment", createAppointment);
router.post("/getAppointments/:userType", getAppointments);
router.put("/updateAppointment/:id", updateAppointment);
router.delete("/deleteAppointment/:id", deleteAppointment);

// Family Member Routes
router.post("/addFamilyMember", addFamilyMember);
router.post("/getFamilyMembers", getFamilyMembers);


///////////
// ZEINA //
///////////
router.post("/getDoctordetails",getDoctordetails)

module.exports = router



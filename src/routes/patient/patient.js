const express = require("express")
const router = express.Router()

const { getDoctors, getDoctordetails } = require('./patientController')

//GET list of all doctors or doctors by searching name and/or speciality
router.post('/getDoctors' , getDoctors)


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



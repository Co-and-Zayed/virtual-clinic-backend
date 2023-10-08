const express = require("express");
const router = express.Router();

const {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment,
} = require("./appointmentController")

const{
    addFamilyMember,
    getFamilyMembers,
} = require("./familyMemberController");

// Appointment Routes
router.post("/createAppointment", createAppointment);
router.post("/getAppointments/:userType", getAppointments);
router.put("/updateAppointment/:id", updateAppointment);
router.delete("/deleteAppointment/:id", deleteAppointment);

// Family Member Routes
router.post("/addFamilyMember", addFamilyMember);
router.post("/getFamilyMembers", getFamilyMembers);

module.exports = router;
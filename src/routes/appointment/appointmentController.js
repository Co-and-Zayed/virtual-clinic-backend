const appointmentModel = require("../../models/appointmentModel");
const { default: mongoose } = require("mongoose");

const createAppointment = async (req, res) => {
    const { patientEmail, doctorEmail, date, status } = req.body;
    
    if (!patientEmail || !doctorEmail || !date || !status) {
        return res.status(400).json({
        message: "Please provide all required fields",
        });
    }
    
    const appointment = new appointmentModel({
        patientEmail: patientEmail,
        doctorEmail: doctorEmail,
        date: date,
        status: status,
    });
    
    try {
        const newAppointment = await appointment.save();
        res.status(201).json({
        appointment: {...newAppointment._doc, time: newAppointment.time},
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    };

const getAppointments = async (req, res) => {
    const {userType}= req.params;
    const {email} = req.body;
    try {
        var appointments = [];
        if(userType === "PATIENT"){
         appointments = await appointmentModel.find({patientEmail: email}).select("-patientEmail");
        }
        else
        {
         appointments = await appointmentModel.find({doctorEmail: email}).select("-doctorEmail");
        }
        const appointmentsWithTime = appointments.map(appointment => {
            return {
                ...appointment.toObject(), // Use toObject() to get the document data
                time: appointment.time // Include the virtual "time" property
            };
        });

        res.json(appointmentsWithTime);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { patientEmail, doctorEmail, date, time, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No appointment with id: ${id}`);
    }
    const updatedAppointment = { patientEmail, doctorEmail, date, time, status, _id: id };
    await appointmentModel.findByIdAndUpdate(id, updatedAppointment, { new: true });
    res.json(updatedAppointment);
    };

const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No appointment with id: ${id}`);
    }
    await appointmentModel.findByIdAndRemove(id);
    res.json({ message: "Appointment deleted successfully." });
    };

    //Checking if the date and time for an appointment is valid to be created 
    //(Should be used in create and update appointment)


module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment };
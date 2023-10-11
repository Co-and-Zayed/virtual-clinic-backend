const appointmentModel = require("../../models/appointmentModel");
const { default: mongoose } = require("mongoose");
const userModel = require("../../models/userModel");

// POST create a new appointment
// Params: patientUsername, doctorUsername, date, status
const createAppointment = async (req, res) => {
  const { patientUsername, doctorUsername, date, status } = req.body;

  if (!patientUsername || !doctorUsername || !date || !status) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const appointment = new appointmentModel({
    patientUsername: patientUsername,
    doctorUsername: doctorUsername,
    date: date,
    status: status,
  });

  try {
    const newAppointment = await appointment.save();
    res.status(201).json({
      appointment: { ...newAppointment._doc, time: newAppointment.time },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAppointments = async (req, res) => {
  const { username, type} = req.user;
  try {
    var appointments = [];
    if (type === "PATIENT") {
      appointments = await appointmentModel
        .find({ patientUsername: username })
        .select("-patientUsername");
    } else {
      appointments = await appointmentModel
        .find({ doctorUsername: username })
        .select("-doctorUsername");
    }
    const appointmentsWithTime = appointments.map((appointment) => {
      return {
        ...appointment.toObject(), // Use toObject() to get the document data
        time: appointment.time, // Include the virtual "time" property
      };
    });
    res.json(appointmentsWithTime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { patientUsername, doctorUsername, date, time, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No appointment with id: ${id}`);
  }
  const updatedAppointment = {
    patientUsername,
    doctorUsername,
    date,
    time,
    status,
  };
  await appointmentModel.findByIdAndUpdate(id, updatedAppointment, {
    new: true,
  });
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

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};

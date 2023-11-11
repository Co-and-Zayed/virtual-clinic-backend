const appointmentModel = require("../../models/appointmentModel");
const patientModel = require("../../models/patientModel");
const doctorModel = require("../../models/doctorModel");
const { default: mongoose } = require("mongoose");

// POST create a new appointment
// Params: patientId, doctorId, date, status
const createAppointment = async (req, res) => {
  const { patientId, doctorId, date, status } = req.body;

  if (!patientId || !doctorId || !date || !status) {
    return res.status(400).json({
      message:
        "Please provide all required fields: patientId, doctorId, date, status",
    });
  }

  const appointment = new appointmentModel({
    patientId: patientId,
    doctorId: doctorId,
    date: date,
    status: status,
  });

  try {
    const newAppointment = await appointment.save();
    
    res.status(200).json({
      appointment: { ...newAppointment._doc, time: newAppointment.time },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAppointments = async (req, res) => {
  const { userType } = req.params;
  var { id } = req.body;
  // convert id to ObjectId
  id = new mongoose.Types.ObjectId(id);
  try {
    var appointments = [];
    console.log("CHECKPOINT 1");
    if (userType === "PATIENT") {
      appointments = await appointmentModel
        .find({ patientId: id })
        .lean()
        .select("-patientId");

      const patient = await patientModel
        .find(id)
        .select("-password")
        .lean();

      for (let i = 0; i < appointments.length; i++) {
        const appointment = appointments[i];

        const doctor = await doctorModel
          .findById(appointment.doctorId)
          .select("-password")
          .lean();

        appointments[i] = {
          ...appointment,
          patient,
          doctor,
          time: appointment.time,
        };
      }
    } else {
      console.log("CHECKPOINT 2");
      appointments = await appointmentModel
        .find({ doctorId: id })
        .lean()
        .select("-doctorId");

      const doctor = await doctorModel.findById(id).select("-password").lean();

      for (let i = 0; i < appointments.length; i++) {
        const appointment = appointments[i];

        const patient = await patientModel
          .findById(appointment.patientId)
          .select("-password")
          .lean();

        appointments[i] = {
          ...appointment,
          patient,
          doctor,
          time: appointment.time,
        };
      }
    }

    console.log("CHECKPOINT 3");
    const appointmentsWithTime = appointments.map((appointment) => {
      return {
        ...appointment, // Use toObject() to get the document data
        time: appointment.time, // Include the virtual "time" property
      };
    });
    console.log("CHECKPOINT 4");
    // sort appointments by date
    appointmentsWithTime.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    res.json(appointmentsWithTime);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { patientId, doctorId, date, time, status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No appointment with id: ${id}`);
  }
  const updatedAppointment = {
    patientId,
    doctorId,
    date,
    time,
    status,
    _id: id,
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

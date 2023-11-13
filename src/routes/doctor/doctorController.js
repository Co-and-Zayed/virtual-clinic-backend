const appointmentModel = require("../../models/appointmentModel");
const doctorModel = require("../../models/doctorModel");
const patientModel = require("../../models/patientModel");
const contractModel = require("../../models/contractModel");

//GET a patient's information and health records
const getPatientInfo = async (req, res) => {
  // we will be getting the ID by selecting the name

  const _id = req.body._id;
  try {
    const patient = await patientModel.findById(_id);
    res.status(200).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const viewSettings = async (req, res) => {
  // we will be getting the ID by selecting the name

  const _id = req.body._id;
  try {
    const doctor = await doctorModel.findById(_id);
    res.status(200).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//GET list of all patients
const getPatients = async (req, res) => {
  const doctor = req.body.doctor;
  try {
    //  Find all appointments with the specified doctor's email
    const appointments = await appointmentModel.find({ doctorEmail: doctor });
    const patientEmails = appointments.map(
      (appointment) => appointment.patientEmail
    );

    // Find patients using the extracted patient emails
    const patients = await patientModel.find({ email: { $in: patientEmails } });
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

//GET patients based on upcomimg appointments
const getUpcomingAptmnts = async (req, res) => {
  try {
    const { username } = req.body;

    // Find all upcoming appointments with the specified doctor's email
    const upcomingAppointments = await appointmentModel.find({
      doctorUsername: username,
      status: "UPCOMING",
    });
    const patientEmails = upcomingAppointments.map(
      (appointment) => appointment.patientEmail
    );

    const patients = await patientModel.find({ email: { $in: patientEmails } });
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

//GET patients by searching name find({name : req.body.name})
const getPatientsByName = async (req, res) => {
  const name = req.body.name;
  try {
    const patient = await patientModel.find({ name: name });
    res.status(200).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//PATCH email, hourly rate, affiliation

const editSettings = async (req, res) => {
  const _id = req.body._id;
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { _id: _id },
      { ...req.body }
    );

    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

const viewAllContracts = async (req, res) => {
  const { username } = req.user;
  try {
    const contract = await contractModel.find({ doctorUsername: username });
    res.status(200).json(contract);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

const acceptContract = async (req, res) => {
  const { _id } = req.body;
  try {
    const contract = await contractModel.findOneAndUpdate(
      { _id: _id },
      { status: "ACCEPTED" },
      { new: true }
    );
    res.status(200).json(contract);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

const rejectContract = async (req, res) => {
  const { _id } = req.body;
  try {
    const contract = await contractModel.findOneAndUpdate(
      { _id: _id },
      { status: "REJECTED" },
      { new: true }
    );
    res.status(200).json(contract);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
};

module.exports = {
  getPatientInfo,
  getPatients,
  getPatientsByName,
  getUpcomingAptmnts,
  editSettings,
  viewSettings,
  viewAllContracts,
  acceptContract,
  rejectContract,
};

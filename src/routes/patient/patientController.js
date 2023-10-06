const Doctor = require("../../models/doctorModel.js");
const Patient = require("../../models/patientModel.js");
const Package = require("../../models/packageModel.js");


//GET list of all doctors
const getDoctors = async (req, res) => {
  try {
    // get patient email from request body
    let email = req.body.email;
    if (!email) {
      res.status(400).json({ message: "Patient Email is required" });
      return;
    }
    // Get patient
    const patient = Patient.findOne({ email: email });
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    // Get patient health package
    const patientPackageId = patient.healthPackage;

    const discount = 0;

    // If the patient has a health package
    if (patientPackageId) {
      const patientPackage = Package.findOne({ _id: patientPackageId });
      discount = patientPackage.doctor_session_discount;
    }

    const doctors = await Doctor.find();

    // Add to each doctor a field called session_price which is calculated from the patient's healthPackage
    for (let i = 0; i < doctors.length; i++) {
      let doctor = doctors[i];
      let session_price = doctor.hourlyRate * 1.1;
      session_price -= session_price * (discount / 100);
      doctor.session_price = session_price;
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error getting doctors:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

//GET doctors by searching name and/or speciality
const getDoctorsByNameSpeciality = async (req, res) => {
  try {
    // Check if name and specialty are provided
    let params = {};
    if (req.body.name) {
      params.name = req.body.name;
    }
    if (req.body.specialty) {
      params.specialty = req.body.specialty;
    }

    const doctors = await Doctor.find(params);
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error getting doctors:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

module.exports = { getDoctors, getDoctorsByNameSpeciality };

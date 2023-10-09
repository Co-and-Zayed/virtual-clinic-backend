const Doctor = require("../../models/doctorModel.js");
const Patient = require("../../models/patientModel.js");
const Package = require("../../models/packageModel.js");

//GET list of all doctors or doctors by searching name and/or speciality
const getDoctors = async (req, res) => {
  try {
    // get patient email from request body
    let email = req.body.email;
    if (!email) {
      res
        .status(400)
        .json({ message: "Patient Email is required", req: req.body });
      return;
    }
    // Get patient
    var patient = await Patient.findOne({ email: email });
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    // Get patient health package
    const patientPackageId = patient.healthPackage;

    var discount = 0;

    // If the patient has a health package
    if (patientPackageId) {
      const patientPackage = await Package.findOne({ _id: patientPackageId });

      discount = patientPackage.doctor_session_discount;
    }

    let params = {};
    if (req.body.name) {
      params.name = new RegExp(req.body.name, "i");
    }
    if (req.body.specialty) {
      params.specialty = req.body.specialty;
    }

    const doctors = await Doctor.find(params).lean();

    // Add to each doctor a field called session_price which is calculated from the patient's healthPackage
    for (let i = 0; i < doctors.length; i++) {
      let doctor = doctors[i];
      let session_price = doctor.hourlyRate * 1.1;
      session_price -= session_price * discount;
      doctor.session_price = session_price;
    }

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error getting doctors:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

///////////
// ZEINA //
///////////
const getDoctordetails = async (req, res) => {
  // view doctor details by selecting the name.
  const username = req.body.username;

  try {
    const doctor = await Doctor.find({ username });

    res.status(200).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getDoctors, getDoctordetails };

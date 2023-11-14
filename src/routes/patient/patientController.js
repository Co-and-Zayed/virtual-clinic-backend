const Doctor = require("../../models/doctorModel.js");
const patientModel = require("../../models/patientModel.js");
const Package = require("../../models/packageModel.js");
const Appointment = require("../../models/appointmentModel.js");

//GET list of all doctors or doctors by searching name and/or speciality
const getDoctors = async (req, res) => {
  try {
    // get user form request
    const user = req.user;

    if (!user) {
      res
        .status(400)
        .json({ message: "Valid user is required", req: req.body });
      return;
    }
    // Get patient
    var patient = await patientModel.findOne({ username: user.username });
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

const filterDoctors = async (req, res) => {
  try {
    // get user from request
    const user = req.user;

    if (!user) {
      res
        .status(400)
        .json({ message: "Valid user is required", req: req.body });
      return;
    }
    // Get patient
    var patient = await patientModel.findOne({ username: user.username });
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

    const doctors = await Doctor.find(
      req.body.specialty && { specialty: req.body.specialty }
    ).lean();

    // combine date and time into a single date object
    const myDate = new Date(req.body.date);
    const time = new Date(req.body.time);

    var date = new Date(
      myDate.getFullYear(),
      myDate.getMonth(),
      myDate.getDate(),
      time.getHours()
    );
    // date.setHours(time.getHours());
    // date.setMinutes(0);
    // date.setSeconds(0);
    // date.setMilliseconds(0);

    console.log("date", date);

    // Get the doctors that have an appointment at the specified date and time
    // const appointments = await Appointment.find({
    //   date: date,
    // }).lean();

    var allApps = await Appointment.find().lean();

    // comapre each date with the date in the request
    const appointments = allApps.filter((appointment) => {
      const appDate = new Date(appointment.date);
      // console.log("appointment.date", appDate);
      // console.log("date", date);
      return appDate.toString() == date.toString();
      // console.log("res", res, "\n");
      // return res;
    });

    console.log("appointments at date: ", appointments);

    // Get the doctors that have an appointment at the specified date and time
    const doctorsWithAppointments = appointments.map(
      (appointment) => appointment.doctorUsername
    );

    console.log("doctorsWithAppointments", doctorsWithAppointments);

    // Filter out the doctors that have an appointment at the specified date and time
    const filteredDoctors = doctors.filter(
      (doctor) => !doctorsWithAppointments.includes(doctor.username)
    );

    // Add to each doctor a field called session_price which is calculated from the patient's healthPackage
    for (let i = 0; i < filteredDoctors.length; i++) {
      let doctor = filteredDoctors[i];
      let session_price = doctor.hourlyRate * 1.1;
      session_price -= session_price * discount;
      doctor.session_price = session_price;
    }

    res.status(200).json(filteredDoctors);
  } catch (error) {
    console.error("Error getting doctors:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// Deduct Money from Wallet
const payWithWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = req.user;

    if (!user) {
      res.status(400).json({ message: "Valid user is required" });
      return;
    }

    const patient = await patientModel.findOne({ username: user.username });

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }

    if (patient.wallet < amount) {
      res.status(400).json({ message: "Not enough money in wallet" });
      return;
    }

    patient.wallet = patient.wallet - amount;
    var result = await patient.save();

    // update patient
    // var result = await patientModel.updateOne(
    //   { 'username': patient.username },
    //   { 'wallet': patient.wallet }
    // );
    console.log("result", result);

    res
      .status(200)
      .json({ message: "Money deducted successfully", user: patient });
  } catch (error) {
    console.error("Error deducting money:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

///////////
// ZEINA //
///////////
const getDoctordetails = async (req, res) => {
  // get user form request
  const user = req.user;

  if (!user) {
    res.status(400).json({ message: "Valid user is required", req: req.body });
    return;
  }

  // Get patient
  var patient = await patientModel.findOne({ username: user.username });
  if (!patient) {
    res.status(404).json({ message: "Patient not found" });
    return;
  }
  console.log("patient", patient);

  // Get patient health package
  const patientPackageId = patient.healthPackage;
  console.log("patientPackageId", patientPackageId);

  var discount = 0;

  // If the patient has a health package
  if (patientPackageId) {
    const patientPackage = await Package.findOne({ _id: patientPackageId });

    discount = patientPackage.doctor_session_discount;
  }

  // view doctor details by selecting the name.
  const username = req.body.username;

  try {
    const doctor = await Doctor.findOne({ username }).lean();

    let session_price = doctor.hourlyRate * 1.1;
    console.log("session_price before", session_price);
    console.log("hourlyRate", doctor.hourlyRate);

    session_price -= session_price * discount;
    doctor.session_price = session_price;

    console.log("doctor", doctor);
    console.log("session_price", session_price);
    console.log("discount", discount);

    // Get their appointments
    const appointments = await Appointment.find({
      doctorId: doctor._id,
    }).lean();

    doctor.appointments = appointments;

    res.status(200).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//function that checks if new password has atleast 1 capital letter.
const hasUpperCase = (pass) => {
  return /[A-Z]/.test(pass);
};

// Function to check if the new password has at least 1 number
const hasNumber = (pass) => {
  return /\d/.test(pass);
};

const changepassword = async (req, res) => {
  const user = req.user;

  const { oldpassword, newpassword, confirmedpassword } = req.body;

  var correct = true;
  // var isvalid=true;
  try {
    const patient = await patientModel.findOne({ username: user.username });
    //const pass = object.password;
    if (patient.password !== oldpassword) {
      correct = false;
      res.status(401).json({ message: "Password is Incorrect" });
      return;
    }
    if (newpassword !== confirmedpassword) {
      correct = false;
      res.status(401).json({ message: "Confirmed Password is Incorrect" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Server error" });
  }
  if (correct) {
    const newpatient = await patientModel.findOneAndUpdate(
      { username: user.username },
      { $set: { password: newpassword } }
    );

    res
      .status(200)
      .json({ message: "You have successfully changed your password!" });
  }
};

module.exports = {
  getDoctors,
  getDoctordetails,
  filterDoctors,
  payWithWallet,
  changepassword,
};

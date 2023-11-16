const Doctor = require("../../../../models/doctorModel.js");
//const patientModel = require("../../../../models/patientModel.js");
const Package = require("../../../../models/packageModel.js");
const Appointment = require("../../../../models/appointmentModel.js");
const patientModel = require("../../../../models/patientModel.js");
const packageModel = require("../../../../models/packageModel.js");
const familyMembersModel = require("../../../../models/familyMembersModel.js");
const { getBucketName } = require("../../../../utils/getBucketName.js");

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

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }

  const patient = await patientModel.findOne({ username: user?.username });

  patient.password = password;
  await patient.save();

  return res.json({
    success: true,
    message: "Password Reset",
  });
};

// Change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }

  const patient = await patientModel.findOne({ username: user?.username });

  if (patient.password !== oldPassword) {
    return res.status(400).json({
      success: false,
      message: "Old Password is incorrect",
    });
  }

  patient.password = newPassword;
  await patient.save();

  return res.json({
    success: true,
    message: "Password Changed Successfully!",
  });
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

const getHealthPackages = async (req, res) => {
  try {
    const healthPackages = await Package.find();

    res.status(200).json(healthPackages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const viewPackages = async (req, res) => {
  const patientID = req.body.patientID; // get the patient ID to add to it the HP
  try {
    const patient = await patientModel.findById(patientID);
    var package = null;
    const familyMembers = patient.familyMembers;
    var maxDiscount = 0;
    let responsePackage = null; // Create a copy of the package
    let responseArray = [];
    const packages = await packageModel.find();
    for (let i = 0; i < familyMembers.length; i++) {
      if (familyMembers[i].type == "EXISTING") {
        const familyPatient = await patientModel.findById(familyMembers[i].id);
        const familyPatientPackage = await packageModel.findById(
          familyPatient.healthPackage
        );
        if (
          familyPatientPackage &&
          (familyPatient.healthPackageStatus == "SUBSCRIBED" ||
            familyPatient.healthPackageStatus == "UNSUBSCRIBED")
        ) {
          if (familyPatientPackage.family_discount > maxDiscount) {
            maxDiscount = familyPatientPackage.family_discount;
          }
        }
      }
    }
    if (patient.healthPackage) {
      package = await packageModel.findById(patient.healthPackage);
      responsePackage = { ...package.toObject() };
      responsePackage.status = patient.healthPackageStatus;
      responsePackage.healthPackageRenewalDate =
        patient.healthPackageRenewalDate;
      if (maxDiscount > 0) {
        const price = responsePackage.price_per_year;
        responsePackage.discountedPrice = (1 - maxDiscount) * price;
      }
      responseArray.push(responsePackage);
      for (let i = 0; i < packages.length; i++) {
        if (maxDiscount > 0) {
          if (!packages[i]._id.equals(package._id)) {
            responsePackage = { ...packages[i].toObject() };
            const price = responsePackage.price_per_year;
            responsePackage.discountedPrice = (1 - maxDiscount) * price;
            responseArray.push(responsePackage);
            // console.log(responsePackage);
            // console.log(responsePackage._id);
          }
        } else {
          if (!packages[i]._id.equals(package._id)) {
            responseArray.push(packages[i]);
            // console.log(packages[i]);
            // console.log(package._id);
          }
        }
      }
    } else {
      for (let i = 0; i < packages.length; i++) {
        if (maxDiscount > 0) {
          responsePackage = { ...packages[i].toObject() };
          const price = responsePackage.price_per_year;
          responsePackage.discountedPrice = (1 - maxDiscount) * price;
          responseArray.push(responsePackage);
        } else {
          responseArray.push(packages[i]);
        }
      }
    }
    res.status(200).json(responseArray);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPackagePrice = async (req, res) => {
  // called when we click "subscribe" to take us to payment page
  const patientID = req.body.patientID;
  const packageID = req.body.packageID;

  try {
    const patient = await patientModel.findById(patientID);
    const patientHealthPackage = await packageModel.findById(
      patient.healthPackage
    );
    const package = await packageModel.findById(packageID);

    let responsePackage = { ...package.toObject() }; // Create a copy of the package

    if (patientHealthPackage != null) {
      const discount = patientHealthPackage.family_discount;
      const price = package.price_per_year;
      const discountedPrice = (1 - discount) * price;

      responsePackage.discountedPrice = discountedPrice;
      console.log(discountedPrice);
    }

    res.status(200).json(responsePackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const viewSubscribedPackage = async (req, res) => {
  // for patient
  const patientID = req.body.patientID;
  try {
    const patient = await patientModel.findById(patientID);
    var package = null;
    let responsePackage = null; // Create a copy of the package
    if (patient.healthPackage) {
      package = await packageModel.findById(patient.healthPackage);
      responsePackage = { ...package.toObject() };
      responsePackage.status = patient.healthPackageStatus;
    }
    res.status(200).json(responsePackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const viewSubscribedPackageforFamilyMember = async (req, res) => {
  // for family member
  const ID = req.body.ID; // of family member (patient or guest)
  const patientID = req.body.patientID;

  try {
    const loggedInPatient = await patientModel.findById(patientID);
    const patient = await patientModel.findById(ID);
    const loggedInPatientPackage = await packageModel.findById(
      loggedInPatient.healthPackage
    );
    var package = null;
    let responsePackage = null; // Create a copy of the package
    let responseArray = [];
    var discount = 0;
    if (loggedInPatientPackage) {
      discount = loggedInPatientPackage.family_discount;
    }
    const packages = await packageModel.find();
    if (!patient) {
      const familyMember = await familyMembersModel.findById(ID);
      package = await packageModel.findById(familyMember.healthPackage);
      if (package) {
        responsePackage = { ...package.toObject() };
        responsePackage.status = familyMember.healthPackageStatus;
        responsePackage.healthPackageRenewalDate =
          familyMember.healthPackageRenewalDate;
        if (discount > 0) {
          const price = responsePackage.price_per_year;
          const discountedPrice = (1 - discount) * price;
          responsePackage.discountedPrice = discountedPrice;
        }
        responseArray.push(responsePackage);
      }
      for (let i = 0; i < packages.length; i++) {
        if (!packages[i].equals(package)) {
          if (discount > 0) {
            responsePackage = { ...packages[i].toObject() };
            const price = responsePackage.price_per_year;
            responsePackage.discountedPrice = (1 - discount) * price;
            responseArray.push(responsePackage);
          } else {
            responseArray.push(packages[i]);
          }
        }
      }
    } else {
      package = await packageModel.findById(patient.healthPackage);
      if (package) {
        responsePackage = { ...package.toObject() };
        responsePackage.status = patient.healthPackageStatus;
        responsePackage.healthPackageRenewalDate =
          patient.healthPackageRenewalDate;
        if (discount > 0) {
          const price = responsePackage.price_per_year;
          const discountedPrice = (1 - discount) * price;
          responsePackage.discountedPrice = discountedPrice;
        }
        responseArray.push(responsePackage);
      }
      for (let i = 0; i < packages.length; i++) {
        if (!packages[i].equals(package)) {
          if (discount > 0) {
            responsePackage = { ...packages[i].toObject() };
            const price = responsePackage.price_per_year;
            responsePackage.discountedPrice = (1 - discount) * price;
            responseArray.push(responsePackage);
          } else {
            responseArray.push(packages[i]);
          }
        }
      }
    }
    res.status(200).json(responseArray);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const subscribeToPackage = async (req, res) => {
  // assuming payment has been finalized (hetet el stripe di kolaha khelset)
  const healthPackageID = req.body.packageID;
  const patientID = req.body.patientID; // get the patient ID to add to it the HP
  try {
    const package = await packageModel.findById(healthPackageID);
    console.log(healthPackageID);
    const currentDate = new Date();
    // Add one year to the current date
    const oneYearLater = new Date(currentDate);
    oneYearLater.setFullYear(currentDate.getFullYear() + 1);
    const patientFind = await patientModel.findById(patientID);
    var packageOld = await packageModel.findById(patientFind.healthPackage);
    let responsePackage = null;
    console.log(packageOld + "!!!");
    console.log(package + "!!");
    console.log(patientFind.healthPackageStatus);
    if (patientFind.healthPackageStatus != "SUBSCRIBED") {
      const patient = await patientModel.findOneAndUpdate(
        { _id: patientID },
        {
          healthPackage: package,
          healthPackageStatus: "SUBSCRIBED",
          healthPackageRenewalDate: oneYearLater,
        }
      );
      responsePackage = { ...package.toObject() };
      responsePackage.status = patient.healthPackageStatus;
    } else {
      responsePackage = { ...packageOld.toObject() };
      responsePackage.status = patientFind.healthPackageStatus;
    }
    res.status(200).json(responsePackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const subscribeToPackageForGuest = async (req, res) => {
  // assuming payment has been finalized (hetet el stripe di kolaha khelset)
  const packageID = req.body.packageID;
  const guestID = req.body.guestID;
  try {
    var package = await packageModel.findById(packageID);
    const currentDate = new Date();
    // Add one year to the current date
    const oneYearLater = new Date(currentDate);
    oneYearLater.setFullYear(currentDate.getFullYear() + 1);
    const guestFind = await familyMembersModel.findById(guestID);
    var packageOld = await packageModel.findById(guestFind.healthPackage);
    if (guestFind.healthPackageStatus != "SUBSCRIBED") {
      const guest = await familyMembersModel.findOneAndUpdate(
        { _id: guestID },
        {
          healthPackage: package._id,
          healthPackageStatus: "SUBSCRIBED",
          healthPackageRenewalDate: oneYearLater,
        }
      );
      responsePackage = { ...package.toObject() };
      responsePackage.status = guest.healthPackageStatus;
    } else {
      responsePackage = { ...packageOld.toObject() };
      responsePackage.status = guestFind.healthPackageStatus;
    }
    res.status(200).json(responsePackage); // this is called when we click on the subscribe button to take us to the payment page (passing the needed data with us). However, the package is only added to the guest after the payment has been finalized
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const subscribeToPackageForFamilyPatient = async (req, res) => {
  // assuming payment has been finalized (hetet el stripe di kolaha khelset)
  const packageID = req.body.packageID;
  const patientID = req.body.patientID; // family member patient
  try {
    const familyPatient = await patientModel.findById(patientID);
    var package = await packageModel.findById(packageID);
    if (familyPatient) {
      const currentDate = new Date();
      // Add one year to the current date
      const oneYearLater = new Date(currentDate);
      oneYearLater.setFullYear(currentDate.getFullYear() + 1);
      const familyPatientFind = await patientModel.findById(patientID);
      var packageOld = await packageModel.findById(
        familyPatientFind.healthPackage
      );
      if (familyPatientFind.healthPackageStatus != "SUBSCRIBED") {
        const familyPatient = await patientModel.findOneAndUpdate(
          { _id: patientID },
          {
            healthPackage: package._id,
            healthPackageStatus: "SUBSCRIBED",
            healthPackageRenewalDate: oneYearLater,
          }
        );
        responsePackage = { ...package.toObject() };
        responsePackage.status = familyPatient.healthPackageStatus;
      } else {
        responsePackage = { ...packageOld.toObject() };
        responsePackage.status = familyPatientFind.healthPackageStatus;
      }
    } else {
      const currentDate = new Date();
      // Add one year to the current date
      const oneYearLater = new Date(currentDate);
      oneYearLater.setFullYear(currentDate.getFullYear() + 1);
      const guestFind = await familyMembersModel.findById(patientID);
      var packageOld = await packageModel.findById(guestFind.healthPackage);
      if (guestFind.healthPackageStatus != "SUBSCRIBED") {
        const guest = await familyMembersModel.findOneAndUpdate(
          { _id: patientID },
          {
            healthPackage: package._id,
            healthPackageStatus: "SUBSCRIBED",
            healthPackageRenewalDate: oneYearLater,
          }
        );
        responsePackage = { ...package.toObject() };
        responsePackage.status = guest.healthPackageStatus;
      } else {
        responsePackage = { ...packageOld.toObject() };
        responsePackage.status = guestFind.healthPackageStatus;
      }
    }
    res.status(200).json(responsePackage); // this is called when we click on the subscribe button to take us to the payment page (passing the needed data with us). However, the package is only added to the guest after the payment has been finalized
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const unsubscribeFromPackage = async (req, res) => {
  const patientID = req.body.patientID; // get the patient ID to add to it the HP
  try {
    const patient = await patientModel.findOneAndUpdate(
      { _id: patientID },
      { healthPackageStatus: "UNSUBSCRIBED" },
      { new: true }
    );
    var package = await packageModel.findById(patient.healthPackage);
    responsePackage = { ...package.toObject() };
    responsePackage.status = patient.healthPackageStatus;
    res.status(200).json(responsePackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const unsubscribeFromPackageforFamily = async (req, res) => {
  const ID = req.body.ID; // of family member (patient or guest)
  try {
    const patient = await patientModel.findById(ID);
    var package = null;
    let responsePackage = null; // Create a copy of the package
    if (!patient) {
      const familyMember = await familyMembersModel.findOneAndUpdate(
        { _id: ID },
        { healthPackageStatus: "UNSUBSCRIBED" }
      );
      package = await packageModel.findById(familyMember.healthPackage);
      responsePackage = { ...package.toObject() };
      responsePackage.status = familyMember.healthPackageStatus;
    } else {
      const patient = await patientModel.findOneAndUpdate(
        { _id: ID },
        { healthPackageStatus: "UNSUBSCRIBED" }
      );
      package = await packageModel.findById(patient.healthPackage);
      responsePackage = { ...package.toObject() };
      responsePackage.status = patient.healthPackageStatus;
    }
    res.status(200).json(responsePackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateMedicalHistory = async (req, res) => {
  const { username } = req.user;
  const medicalHistory = req.files;
  console.log("MEDICAL HISTORY");
  console.log(medicalHistory);
  try {
    const newMedicalHistory = medicalHistory.map((file) =>
      getBucketName(req, file.originalname)
    );
    const patient = await patientModel.findOneAndUpdate(
      { username },
      { medicalHistory: newMedicalHistory }
    );
    res
      .status(200)
      .json({ message: "Medical history updated successfully", patient });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getHealthRecords = async (req, res) => {
  const { username } = req.user;

  try {
    const patient = await patientModel.findOne({ username });

    if (!patient) {
      res.status(404).json({ message: "Patient Not Found" });
    }

    const healthRecords = patient.healthRecords;

    res.status(200).json({
      message: "Health Records Retrieved Successfully",
      healthRecords,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/*
  REMINDER TO ADD DATE CHECK WITH THE START OF EVERY SESSION IN ORDER TO CHANEG THE STATUS OF THE SUBSCRIPTION WHEN NEEDED
  CASES:
  1. SUBSCRIBED AND RENEWAL DATE HAS YET TO COME. STATUS IS SUBSCRIBED AND BENEFITS APPLY
  2. UNSUBSCRIBED BUT RENEWAL DATE HAS YET TO COME SO STATUS IS UNSUBSCRIBED BUT BENEFITS STILL APPLY.
  3. UNSUBSCRIBED AND RENEWAL DATE PASSED. STATUS IS UNSUBSCRIBED (OR CANCELLED?) AND BENEFITS DO NOT APPLY.
  4. RENEWAL DATE HAS PASSED AND PATIENT DID NOT PAY. STATUS IS CANCELLED AND BENEFITS DO NOT APPLY
*/

module.exports = {
  getDoctors,
  getDoctordetails,
  filterDoctors,
  getHealthPackages,
  subscribeToPackage,
  viewPackages,
  getPackagePrice,
  subscribeToPackageForGuest,
  subscribeToPackageForFamilyPatient,
  viewSubscribedPackage,
  viewSubscribedPackageforFamilyMember,
  unsubscribeFromPackage,
  unsubscribeFromPackageforFamily,
  payWithWallet,
  updateMedicalHistory,
  resetPassword,
  getHealthRecords,
  changePassword,
};

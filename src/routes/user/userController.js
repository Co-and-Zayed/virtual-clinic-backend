const userModel = require("../../models/userModel");
const { createUserTokens } = require("../auth/authController");
const doctorModel = require("../../models/doctorModel");
const patientModel = require("../../models/patientModel");
const adminModel = require("../../models/adminModel");

const findUser = async (username) => {
  try {
    // Find a user by the provided email
    const user = await userModel.findOne({ username });
    if (user) {
      return user;
    } else {
      const admin = await adminModel.findOne({ username });
      if (admin) return admin;
    }
    return null;
  } catch (error) {
    res.json({ message: "Error finding the user" });
  }
};

const loginUser = async (req, res) => {
  const { username, password, token } = req.body;

  const user = await findUser(username);

  var object = {};

  if (user?.type == "DOCTOR") {
    object = await doctorModel.findOne({ username: username });
    if (object?.password !== password) {
      return res.status(401).json({ message: "Email Or Password Incorrect" });
    }
  } else if (user?.type == "PATIENT") {
    object = await patientModel.findOne({ username: username });
    if (object?.password !== password) {
      return res.status(401).json({ message: "Email Or Password Incorrect" });
    }
  } else {
    object = await adminModel.findOne({ username: username });
    if (object?.password !== password) {
      return res.status(401).json({ message: "Email Or Password Incorrect" });
    }
  }

  if (user) {
    res.status(200).json({
      user: user,
      data: object,
      type: !user?.type ? "ADMIN" : user?.type,
      tokens: await createUserTokens({
        username: username,
        type: !user?.type ? "ADMIN" : user?.type,
        issuedAt: new Date(),
      }),
    });
  } else {
    res.status(400).json({ message: "User not found" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, type } = req.body;

  // Common Fields
  const { username, password, date_of_birth, gender } = req.body;

  // Patient Fields
  const {
    mobileNumber,
    healthRecords,
    emergencyContactName,
    emergencyContactNumber,
  } = req.body;

  // Doctor Fields
  const { specialty, affiliation, educationalBackground, hourlyRate } =
    req.body;

  const entityObject = {};

  if (!name || !email) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const user = new userModel({
    name: name,
    email: email,
    username: username,
    type: type,
  });

  // Field Validation
  if (username) {
    entityObject.username = username;
  }

  if (password) {
    entityObject.password = password;
  }

  if (date_of_birth) {
    entityObject.date_of_birth = date_of_birth;
  }

  if (gender) {
    entityObject.gender = gender;
  }

  if (mobileNumber) {
    entityObject.mobileNumber = mobileNumber;
  }

  if (healthRecords) {
    entityObject.healthRecords = healthRecords;
  }

  if (emergencyContactName) {
    entityObject.emergencyContactName = emergencyContactName;
  }

  if (emergencyContactNumber) {
    entityObject.emergencyContactNumber = emergencyContactNumber;
  }

  if (specialty) {
    entityObject.specialty = specialty;
  }

  if (affiliation) {
    entityObject.affiliation = affiliation;
  }

  if (educationalBackground) {
    entityObject.educationalBackground = educationalBackground;
  }

  if (hourlyRate) {
    entityObject.hourlyRate = hourlyRate;
  }

  // Construct Patient Or Doctor Object
  if (type === "DOCTOR") {
    try {
      const doctor = new doctorModel({
        name,
        email,
        username,
        password,
        gender,
        specialty,
        date_of_birth,
        affiliation,
        educationalBackground,
        hourlyRate,
      });
      await doctor.save();

      const newUser = await user.save();

      return res.status(201).json({
        success: true,
        user: newUser,
        data: doctor,
        type: "DOCTOR",
        tokens: await createUserTokens({
          username: username,
          type: "DOCTOR",
          issuedAt: new Date(),
        }),
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
  if (type === "PATIENT") {
    try {
      const patient = new patientModel({
        name,
        email,
        password,
        username,
        gender,
        date_of_birth,
        mobileNumber,
        healthRecords,
        emergencyContactName,
        emergencyContactNumber,
      });
      await patient.save();

      const newUser = await user.save();

      return res.status(201).json({
        success: true,
        user: newUser,
        data: patient,
        type: "PATIENT",
        tokens: await createUserTokens({
          username: username,
          type: "PATIENT",
          issuedAt: new Date(),
        }),
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
};

module.exports = { registerUser, loginUser };

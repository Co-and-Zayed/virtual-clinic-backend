const userModel = require("../../../../models/userModel");
const { createUserTokens } = require("../../../../routes/auth/authController");
const doctorModel = require("../../../../models/doctorModel");
const patientModel = require("../../../../models/patientModel");
const adminModel = require("../../../../models/adminModel");
const { sendMail } = require("../../../../utils/sendMail");
const { getBucketName } = require("../../../../utils/getBucketName");

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

const getUser = async (req, res) => {
  const { username, type } = req.user;
  if (type === "PATIENT") {
    const patient = await patientModel.findOne({ username });
    if (patient) {
      res.status(200).json({ data: patient });
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } else if (type === "DOCTOR") {
    const doctor = await doctorModel.findOne({ username });
    if (doctor) {
      res.status(200).json({ data: doctor });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } else if (type === "ADMIN") {
    const admin = await adminModel.findOne({ username });
    if (admin) {
      res.status(200).json({ data: admin });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } else {
    res.status(404).json({ message: "Invalid user type" });
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
    } else if (
      //object?.healthPackageStatus === "UNSUBSCRIBED" &&
      object?.healthPackageRenewalDate < new Date()
    ) {
      object.healthPackageStatus = "CANCELLED";
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

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email: email });

  if (!user) {
    return res.json({
      success: false,
      message: "User Not Found",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  user.otp = otp;

  await user.save();

  const subject = "El7a2ni Password Reset";
  const message = `Your OTP to reset your password is ${otp} .\n Please do not share it with anyone.`;

  try {
    sendMail(user.email, subject, message);
    return res.json({
      success: true,
      message: "Reset Password OTP Sent",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "An Error Occurred",
    });
  }
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  const user = await userModel.findOne({ otp: otp });

  if (!user) {
    return res.json({
      success: false,
      message: "Wrong Otp",
    });
  }

  var object = {};

  if (user?.type == "DOCTOR") {
    object = await doctorModel.findOne({ username: user?.username });
  } else if (user?.type == "PATIENT") {
    object = await patientModel.findOne({ username: user?.username });
  } else {
    object = await adminModel.findOne({ username: user?.username });
  }

  res.status(200).json({
    success: true,
    user: user,
    data: object,
    type: !user?.type ? "ADMIN" : user?.type,
    tokens: await createUserTokens({
      username: user?.username,
      type: !user?.type ? "ADMIN" : user?.type,
      issuedAt: new Date(),
    }),
  });
};

const registerUser = async (req, res) => {
  // Files
  const files = req.files;
  console.log("FILES");
  console.log(files);

  const { name, email, type } = req.body;

  // Common Fields
  const { username, password, date_of_birth, gender } = req.body;

  // Cast date_of_birth to Date object
  // const date_of_birth_new = new Date(date_of_birth, "DD/MM/YYYY");

  // Patient Fields
  const { mobileNumber, emergencyContactName, emergencyContactNumber } =
    req.body;

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
    var doctorDocuments = [];
    console.log("FILES");
    console.log(files);
    console.log(req.createdAt);
    if (files !== null && files !== undefined) {
      for (let i = 0; i < files?.length; i++) {
        doctorDocuments.push(`${getBucketName(req, files[i].originalname)}`);
      }
    }
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
        doctorDocuments,
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
      var healthRecords = [];
      console.log("FILES");
      console.log(files);
      if (files !== null && files !== undefined) {
        for (let i = 0; i < files?.length; i++) {
          healthRecords.push(files[i].originalname);
        }
      }
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
      console.log("FILES");
      console.log(files);
      return res.status(400).json({ success: false, message: err.message });
    }
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
  verifyOtp,
  getUser,
};

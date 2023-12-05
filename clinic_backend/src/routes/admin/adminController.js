require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const adminModel = require("../../../../models/adminModel");

const refreshTokensModel = require("../../../../models/refreshTokensModel");
const userModel = require("../../../../models/userModel");
const familyMembersModel = require("../../../../models/familyMembersModel");
const patientModel = require("../../../../models/patientModel");
const doctorModel = require("../../../../models/doctorModel");
const appointmentModel = require("../../../../models/appointmentModel");
const prescriptionsModel = require("../../../../models/prescriptionsModel");
const contractModel = require("../../../../models/contractModel");
const { createUserTokens } = require("../../../../routes/auth/authController");

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await adminModel.findOne({ username });
    res.status(200).json({
      user: user,
      tokens: await createUserTokens({
        username: username,
        type: "ADMIN",
        issuedAt: new Date(),
      }),
    });
  } catch (err) {
    res.status(400).json({ message: "User not found" });
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

  const admin = await adminModel.findOne({ username: user.username });

  admin.password = password;
  await admin.save();

  return res.json({
    success: true,
    message: "Password Reset",
  });
};

const deletePatient = async (req, res) => {
  const { email } = req.body;
  try {
    await userModel.deleteMany({ email });
    await patientModel.deleteMany({ email });
    await appointmentModel.deleteMany({ patientEmail: email });
    await familyMembersModel.deleteMany({ patientEmail: email });
    await refreshTokensModel.deleteMany({ email });
    await prescriptionsModel.deleteMany({ email });
    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "User not found", err: err });
  }
};

const deleteDoctor = async (req, res) => {
  const { username, _id } = req.body;
  try {
    await userModel.deleteMany({ username });
    await doctorModel.deleteMany({ username });
    await appointmentModel.deleteMany({ doctorId: _id });
    await refreshTokensModel.deleteMany({ username });
    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "User not found", err: err });
  }
};

const deleteAdmin = async (req, res) => {
  const { username } = req.body;

  try {
    await adminModel.deleteMany({ username });
    await refreshTokensModel.deleteMany({ username });
    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "User not found", err: err });
  }
};

const createAdmin = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const user = new userModel({
    name: username,
    username: username,
    email: email,
    type: "ADMIN",
  });

  const admin = new adminModel({
    username: username,
    email: email,
    password: password,
  });

  try {
    await user.save();
  } catch (err) {
    return res.json({ message: err.message, status: 409, collection: "user" });
  }

  try {
    await admin.save();
    return res.status(201).json(user);
  } catch (err) {
    return res.json({ message: err.message, status: 409, collection: "admin" });
  }
};

const viewDoctors = async (req, res) => {
  try {
    const allDoctors = await doctorModel.find().select("-password");
    res.status(200).json(allDoctors);
  } catch (err) {
    res.status(400).json({ message: "Error occured", err: err });
  }
};

const viewPatients = async (req, res) => {
  try {
    const allPatients = await patientModel.find().select("-password");
    res.status(200).json(allPatients);
  } catch (err) {
    res.status(400).json({ message: "Error occured", err: err });
  }
};

const acceptDoctor = async (req, res) => {
  const { username } = req.body;
  try {
    const updatedDoctor = await doctorModel.findOneAndUpdate(
      { username: username },
      { $set: { status: "WAITING" } },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    return res.json(updatedDoctor);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const rejectDoctor = async (req, res) => {
  const { username } = req.body;
  try {
    const updatedDoctor = await doctorModel.findOneAndUpdate(
      { username: username },
      { $set: { status: "REJECTED" } },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    return res.json(updatedDoctor);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendContract = async (req, res) => {
  const { username } = req.body;
  try {
    const doctor = await doctorModel.findOne({ username: username });
    const contract = new contractModel({
      doctorUsername: username,
      hourlyRate: doctor.hourlyRate,
      clinicRate: 0.1 * doctor.hourlyRate,
    });
    const updatedDoctor = await doctorModel.findOneAndUpdate(
      { username: username },
      { $set: { contractID: contract._id } },
      { new: true }
    );
    const newContract = await contract.save();
    res.status(201).json(newContract);
  } catch (err) {
    res.json({ message: err.message, status: 409 });
  }
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

  const admin = await adminModel.findOne({ username: user?.username });

  if (admin.password !== oldPassword) {
    return res.status(400).json({
      success: false,
      message: "Old Password is incorrect",
    });
  }

  admin.password = newPassword;
  await admin.save();

  return res.json({
    success: true,
    message: "Password Changed Successfully!",
  });
};

module.exports = {
  loginAdmin,
  createAdmin,
  deletePatient,
  deleteDoctor,
  deleteAdmin,
  viewDoctors,
  viewPatients,
  acceptDoctor,
  rejectDoctor,
  sendContract,
  changePassword,
  resetPassword,
};

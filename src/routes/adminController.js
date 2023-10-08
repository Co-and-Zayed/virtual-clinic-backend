require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");

const refreshTokensModel = require("../models/refreshTokensModel");
const userModel = require("../models/userModel");
const familyMembersModel = require("../models/familyMembersModel");
const patientModel = require("../models/patientModel");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await adminModel.findOne({ username });
    res.status(200).json({
      user: user,
      tokens: await createUserTokens({
        username: username,
        issuedAt: new Date(),
      }),
    });
  } catch (err) {
    res.status(400).json({ message: "User not found" });
  }
};

const deletePatient = async (req, res) => {
  const { email } = req.body;
  try {
    await userModel.deleteMany({ email });
    await patientModel.deleteMany({ email });
    await appointmentModel.deleteMany({ patientEmail: email });
    await familyMembersModel.deleteMany({ patientEmail: email });
    await refreshTokensModel.deleteMany({ email });
    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "User not found", err: err });
  }
};

const deleteDoctor = async (req, res) => {
  const { email } = req.body;
  try {
    await userModel.deleteMany({ email });
    await doctorModel.deleteMany({ email });
    await appointmentModel.deleteMany({ doctorEmail: email });
    await refreshTokensModel.deleteMany({ email });
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
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const user = new adminModel({
    username: username,
    password: password,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Creates a new access token and refresh token for the user
async function createUserTokens(user) {
  const data = {
    username: user.username,
    issuedAt: new Date(),
  };

  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
  const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);

  // Add refresh token to database
  try {
    const refreshTokenToAdd = new refreshTokensModel({
      username: user.username,
      token: refreshToken,
    });
    await refreshTokenToAdd.save();
    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (err) {
    return { message: err.message };
  }
}

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

module.exports = {
  loginAdmin,
  createAdmin,
  deletePatient,
  deleteDoctor,
  deleteAdmin,
  viewDoctors,
  viewPatients,
};
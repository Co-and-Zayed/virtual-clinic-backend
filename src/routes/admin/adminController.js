require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const adminModel = require("../../models/adminModel");

const refreshTokensModel = require("../../models/refreshTokensModel");
const userModel = require("../../models/userModel");
const patientModel = require("../../models/patientModel");
const pharmacistModel = require("../../models/pharmacistModel");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const appointmentModel = mongoose.model(
  "Appointment",
  new Schema({}, { strict: false }),
  "appointments"
);
const familyMembersModel = mongoose.model(
  "FamilyMember",
  new Schema({}, { strict: false }),
  "familymembers"
);
const { createUserTokens } = require("../auth/authController");

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

const deletePatient = async (req, res) => {
  const { username } = req.body;
  var deleted = [];
  try {
    await userModel.deleteMany({ username });
    console.log("USER");
    await patientModel.deleteMany({ username });
    console.log("PATIENT");
    await appointmentModel.deleteMany({ patientUsername: username });
    console.log("APPOINTMENT");

    await familyMembersModel.deleteMany({ patientUsername: username });
    console.log("FAMILY MEMBER");

    await refreshTokensModel.deleteMany({ username });
    console.log("REFRESH TOKEN");
    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "An Error Occured", err: err });
  }
};

const deletePharmacist = async (req, res) => {
  const { username } = req.body;
  try {
    await userModel.deleteMany({ username });
    await pharmacistModel.deleteMany({ username });
    await appointmentModel.deleteMany({ pharmacistUsername: username });
    await refreshTokensModel.deleteMany({ username });
    res.status(200).json({
      message: "Pharmacist deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "An error occurred", err: err });
  }
};

const deleteAdmin = async (req, res) => {
  const { username } = req.body;

  try {
    await adminModel.deleteMany({ username });
    await userModel.deleteMany({ username });
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

  const admin = new adminModel({
    username: username,
    password: password,
  });

  const user = new userModel({
    name: username,
    username: username,
    type: "ADMIN",
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

const viewPharmacists = async (req, res) => {
  try {
    const allPharmacists = await pharmacistModel.find().select("-password");
    res.status(200).json(allPharmacists);
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
  deletePharmacist,
  deleteAdmin,
  viewPharmacists,
  viewPatients,
};

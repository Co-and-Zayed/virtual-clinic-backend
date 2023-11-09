require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const adminModel = require("../../models/adminModel");

const refreshTokensModel = require("../../models/refreshTokensModel");
const userModel = require("../../models/userModel");
const familyMembersModel = require("../../models/familyMembersModel");
const patientModel = require("../../models/patientModel");
const doctorModel = require("../../models/doctorModel");
const appointmentModel = require("../../models/appointmentModel");
const prescriptionsModel = require("../../models/prescriptionsModel");
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
    res.json({ message: err.message, status: 409 });
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


const changePassword = async (req,res) => {
  let newPass = req.body.newpass;
  let confirmNewPass = req.body.confirmpassword;
  if(!newPass || !confirmNewPass){
    return res.status(500).send('Please enter a password');
    }
  else{
    if(newPass !== confirmNewPass){
      return res.status(500).send("The passwords do not match");
    }
    else{
      let hashedPassword = bcryptjs.hashSync(newPass, 12);
      let userId = req.user._id;
      let updatedUser = await adminModel.updateOne({_id:userId},{$set:{password:hashedPassword}});
      if (!updatedUser) {
        throw new Error ("Failed to update password")
      }
      res.status(200).send("Password has been changed successfully!");
    }
  }
}

module.exports = {
  loginAdmin,
  createAdmin,
  deletePatient,
  deleteDoctor,
  deleteAdmin,
  viewDoctors,
  viewPatients,
  changePassword,
};

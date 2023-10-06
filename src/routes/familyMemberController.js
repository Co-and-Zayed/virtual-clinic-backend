const appointmentModel = require("../models/appointmentModel");
const { default: mongoose } = require("mongoose");
const familyMembersModel = require("../models/familyMemberModel");

const addFamilyMember = async (req, res) => {
    const {name, nationalID, age, gender, relationship, patientEmail} = req.body;
    if (!name || !nationalID || !age || !gender || !relationship) {
        return res.status(400).json({
        message: "Please provide all required fields",
        });
    }
    const familyMember = new familyMembersModel({
        name: name,
        nationalID: nationalID,
        age: age,
        gender: gender,
        relationship: relationship,
        patientEmail: patientEmail,
    });
    
    try {
        const newFamilyMember = await familyMember.save();
        res.status(201).json({
        familyMember: newFamilyMember, "message": "Family Member Added Successfully"
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getFamilyMembers = async (req, res) => {
    const patientEmail = req.body.patientEmail;
    if (!patientEmail) {
        return res.status(403).json({
        message: "FORBIDDEN ACCESS",
        });
    }
    try {
        const familyMembers = await familyMembersModel.find({patientEmail: patientEmail});
        res.json(familyMembers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

module.exports = {addFamilyMember, getFamilyMembers};
    


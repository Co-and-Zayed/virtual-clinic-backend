const appointmentModel = require("../../models/appointmentModel");
const { default: mongoose } = require("mongoose");
const familyMembersModel = require("../../models/familyMembersModel");

const addFamilyMember = async (req, res) => {
    const {username} = req.user;
    const {name, nationalID, age, gender, type, relation} = req.body;
    if (!name || !nationalID || !age || !gender || !type || !relation) {
        return res.status(400).json({
        message: "Please provide all required fields",
        });
    }
    const familyMember = new familyMembersModel({
        name: name,
        nationalID: nationalID,
        age: age,
        gender: gender,
        type: type,
        relation: relation,
        relationTo: username,
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
    const {username} = req.user;
    try {
        const familyMembers = await familyMembersModel.find({relationTo: username});
        res.json(familyMembers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

module.exports = {addFamilyMember, getFamilyMembers};
    


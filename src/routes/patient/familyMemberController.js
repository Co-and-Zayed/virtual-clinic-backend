const appointmentModel = require("../../models/appointmentModel");
const { default: mongoose } = require("mongoose");
const familyMembersModel = require("../../models/familyMembersModel");
const patientModel = require("../../models/patientModel");


//CHANGED
const addFamilyMember = async (req, res) => {// THIS WORKS ONLY FOR GUEST FAMILY MEMBERS. YOU STILL NEED TO WRITE THE API FOR AddPatientAsFamilyMember!
    const {name, nationalID, age, gender, relationship, patientEmail} = req.body;
    if (!name || !nationalID || !age || !gender || !relationship) {
        return res.status(400).json({
        message: "Please provide all required fields",
        });
    }
    const familyMember = new familyMembersModel({
        name: name,
        age: age,
        gender: gender,
        nationalID: nationalID,
        relation: relationship,
        type:"GUEST",
        relationTo:patientEmail
    });
    
    try {
        const newFamilyMember = await familyMember.save();
        const famMember = {id:newFamilyMember._id, type:"GUEST"}
        const patient = await patientModel.findOneAndUpdate({email:patientEmail}, {$push: { familyMembers: famMember}});
        res.status(201).json({
        familyMember: newFamilyMember, "message": "Family Member Added Successfully"
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//CHANGED
const getFamilyMembers = async (req, res) => {
    const patientID = req.body.patientID;
    try {
        const patient = await patientModel.findById(patientID);
        let responsefamilyMembers = [];
        var familyMember;
        for (let i = 0; i < (patient.familyMembers).length; i++) {
            console.log("TEST")
            if(patient.familyMembers[i].type == "GUEST"){
                familyMember = await familyMembersModel.findById((patient.familyMembers)[i].id);
            }else{
                familyMember = await patientModel.findById((patient.familyMembers)[i].id);
            }
            responsefamilyMembers.push(familyMember)
            console.log(familyMember);
          }
          res.status(200).json(responsefamilyMembers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {addFamilyMember, getFamilyMembers};
    


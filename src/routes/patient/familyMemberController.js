const appointmentModel = require("../../models/appointmentModel");
const { default: mongoose } = require("mongoose");
const familyMembersModel = require("../../models/familyMembersModel");
const patientModel = require("../../models/patientModel");

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

//TO BE CHANGED (check patient table for patient family members)
const getFamilyMembers = async (req, res) => {
    // const patientEmail = req.body.patientEmail;
    // if (!patientEmail) {
    //     return res.status(403).json({
    //     message: "FORBIDDEN ACCESS",
    //     });
    // }
    const patientID = req.body.patientID;
    try {
        // const familyMembers = await familyMembersModel.find({patientEmail: patientEmail});
        // res.json(familyMembers);
        const patient = await patientModel.findById(patientID);
        let responsefamilyMembers = [100];
        var familyMember;
        console.log(familyMember);
        //console.log("!" + Object.keys(patient.familyMembers).length + "!");
        for (let i = 0; i < 2; i++) {
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
    


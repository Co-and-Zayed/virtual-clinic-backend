const appointmentModel = require("../../models/appointmentModel");
const { default: mongoose } = require("mongoose");
const familyMembersModel = require("../../models/familyMembersModel");
const patientModel = require("../../models/patientModel");
const packageModel = require("../../models/packageModel");

const addFamilyMember = async (req, res) => {
  // THIS WORKS ONLY FOR GUEST FAMILY MEMBERS. YOU STILL NEED TO WRITE THE API FOR AddPatientAsFamilyMember!
  const {
    name,
    nationalID,
    age,
    gender,
    relationship,
    patientEmail,
    isPatient,
    memberEmail,
    memberMobileNumber,
  } = req.body;
  const { username } = req.user;
  if (
    (!isPatient &&
      (!name || !nationalID || !age || !gender || !relationship)) ||
    (isPatient && !memberEmail && !memberMobileNumber)
  ) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  try {
    var famMember;
    if (isPatient) {
      var patientMember;

      if (memberEmail) {
        patientMember = await patientModel.findOne({
          email: memberEmail,
        });
      } else if (memberMobileNumber) {
        patientMember = await patientModel.findOne({
          mobileNumber: memberMobileNumber,
        });
      } else {
        res
          .status(400)
          .json({ message: "Please provide either email or mobile number" });
      }

      famMember = {
        id: patientMember._id,
        type: "EXISTING",
        relation: relationship,
      };
    } else {
      const familyMember = new familyMembersModel({
        name: name,
        age: age,
        gender: gender,
        nationalID: nationalID,
        relation: relationship,
        type: "GUEST",
        relationTo: patientEmail,
      });
      const newFamilyMember = await familyMember.save();
      famMember = {
        id: newFamilyMember._id,
        type: "GUEST",
        relation: relationship,
      };
    }
    console.log(famMember);
    const patient = await patientModel.findOneAndUpdate(
      { username },
      { $push: { familyMembers: famMember } }
    );
    res.status(201).json({
      message: "Family Member Added Successfully",
      familyMember: famMember,
      patient: patient,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//TO BE CHANGED (check patient table for patient family members)
const getFamilyMembers = async (req, res) => {
  // const patientEmail = req.body.patientEmail;
  // if (!patientEmail) {
  //     return res.status(403).json({
  //     message: "FORBIDDEN ACCESS",
  //     });
  // }
  const { username } = req.user;

  // get withDiscounts from req.params
  const { withDiscounts } = req.query;

  console.log("withDiscounts:", withDiscounts);
  console.log("params:", req.query);

  try {
    // const familyMembers = await familyMembersModel.find({patientEmail: patientEmail});
    // res.json(familyMembers);
    const patient = await patientModel.findOne({ username: username });
    let responsefamilyMembers = [];
    var familyMember;
    // console.log(patient);
    //console.log("!" + Object.keys(patient.familyMembers).length + "!");
    for (let i = 0; i < patient.familyMembers.length; i++) {
      console.log("TEST");
      if (patient.familyMembers[i].type == "GUEST") {
        familyMember = await familyMembersModel
          .findById(patient.familyMembers[i].id)
          .lean();
        // Check if they have a healthPackage and healthPackageStatus is SUBSCRIBED
        if (
          withDiscounts &&
          familyMember.healthPackage &&
          familyMember.healthPackageStatus === "SUBSCRIBED"
        ) {
          console.log("TEST2");
          // Get the healthPackage
          const healthPackage = await packageModel.findById(
            familyMember.healthPackage
          );
          // Add the discount to the response
          familyMember.doctor_session_discount =
            healthPackage.doctor_session_discount;
          familyMember.medicine_discount = healthPackage.medicine_discount;
          familyMember.family_discount = healthPackage.family_discount;
        }
        responsefamilyMembers.push({
          familyMember: familyMember,
          type: "GUEST",
        });
      } else {
        familyMember = await patientModel
          .findById(patient.familyMembers[i].id)
          .lean();

        // Check if they have a healthPackage and healthPackageStatus is SUBSCRIBED
        if (
          withDiscounts &&
          familyMember.healthPackage &&
          familyMember.healthPackageStatus === "SUBSCRIBED"
        ) {
          console.log("TEST3");
          // Get the healthPackage
          const healthPackage = await packageModel.findById(
            familyMember.healthPackage
          );
          // Add the discount to the response
          familyMember.doctor_session_discount =
            healthPackage.doctor_session_discount;
          familyMember.medicine_discount = healthPackage.medicine_discount;
          familyMember.family_discount = healthPackage.family_discount;
        }
        responsefamilyMembers.push({
          familyMember: familyMember,
          type: "EXISTING",
          relation: patient.familyMembers[i].relation,
        });
      }
      // console.log(familyMember);
    }
    res.status(200).json(responsefamilyMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addFamilyMember, getFamilyMembers };

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const familyMembersSchema = new Schema(
  {
    nationalID: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ["M", "F"],
        required: true,
    },
    relationship: {
        type: String,
        enum: ["CHILD","HUSBAND","WIFE"],
        required: true,
    },
    patientEmail: {
            type: String,
            required: false,
        },
  },
);

const familyMembersModel = mongoose.model("familyMembers", familyMembersSchema);
module.exports = familyMembersModel;

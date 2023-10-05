const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    username:  {
        type: String,
        required : true
    },
    password:  {
        type: String,
        required : true
    },
    dob:  {
        type: Date,
        required : true
    },
    gender:  {
        type: String,
        enum: ["MALE", "FEMALE"],
        required : true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    healthRecords : {
        type: String,
        required: true
    },
    emergencyContactName: {
        type: String,
        required: true
    },
    emergencyContactNumber: {
        type: String,
        required: true
    },
})

// Define a virtual property to compute the 'age' based on 'dob'.
patientSchema.virtual('age').get(function () {
    const today = new Date();
    const dob = this.dob;
    const age = today.getFullYear() - dob.getFullYear();
  
    // Adjust age if the birthday has not occurred this year yet.
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
  
    return age;
  });


const patientModel = mongoose.model("Patient", patientSchema);
module.exports = patientModel;
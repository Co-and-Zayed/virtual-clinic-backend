const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
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
    specialty:  {
        type: String,
        required : true
    },
    dob:  {
        type: Date,
        required : true
    },
    affiliation:  {
        type: String,
        required : true
    },
    educationalBackground:  {
        type: String,
        required : true
    },
    hourlyRate:  {
        type: Number,
        required : true
    },
}
)

// Define a virtual property to compute the 'age' based on 'dob'.
doctorSchema.virtual('age').get(function () {
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

const doctorModel = mongoose.model("Doctor", doctorSchema);
module.exports = doctorModel;
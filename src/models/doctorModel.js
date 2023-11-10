const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE"],
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  affiliation: {
    type: String,
    required: true,
  },
  educationalBackground: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    default: "PENDING",
  },
});

//Define a virtual property to compute the 'age' based on 'date_of_birth'.
doctorSchema.virtual("age").get(function () {
  const today = new Date();
  const date_of_birth = this.date_of_birth;
  const age = today.getFullYear() - date_of_birth.getFullYear();

  // Adjust age if the birthday has not occurred this year yet.
  const monthDiff = today.getMonth() - date_of_birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < date_of_birth.getDate())
  ) {
    age--;
  }

  return age;
});

const doctorModel = mongoose.model("Doctor", doctorSchema);
module.exports = doctorModel;

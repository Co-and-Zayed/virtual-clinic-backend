const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pharmacistSchema = new Schema({
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
  wallet: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["APPROVED", "PENDING", "REJECTED", "WAITING"],
    default: "PENDING",
  },
  contractID: {
    type: String,
    default: null,
  },
  pharmacistDocuments: {
    type: [String],
    required: false
  }
});

//Define a virtual property to compute the 'age' based on 'date_of_birth'.
pharmacistSchema.virtual("age").get(function () {
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

const pharmacistModel = mongoose.model("Pharmacist", pharmacistSchema);
module.exports = pharmacistModel;

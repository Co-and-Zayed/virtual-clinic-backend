const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  doctorUsername: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"],
    default: "PENDING",
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endDate: {
    type: Date,
    default: () => new Date(+new Date() + 365 * 24 * 60 * 60 * 1000),
  }, // Contract that ends after 1 Year
  role : {
    type: String,
    enum: ["DOCTOR", "PHARMACIST"],
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  clinicRate: {
    type: Number,
    default: 0.1 * this.hourlyRate,
    required: true,
  },
});

const contractModel = mongoose.model("Contract", contractSchema);
module.exports = contractModel;

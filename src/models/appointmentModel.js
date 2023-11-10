const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  patientId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  // time:{
  //     type: String,
  //     required: true,
  // },
  status: {
    type: String,
    enum: ["UPCOMING", "CANCELLED", "COMPLETED"],
    required: true,
  },
});
// Deirive time from date
appointmentSchema.virtual("time").get(function () {
  return this.date.toLocaleTimeString();
});

const appointmentModel = mongoose.model("Appointment", appointmentSchema);
module.exports = appointmentModel;

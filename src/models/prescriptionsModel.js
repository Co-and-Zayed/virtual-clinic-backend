const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionsSchema = new Schema({
  patient: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  filled: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

const prescriptionsModel = mongoose.model("Prescription", prescriptionsSchema);
module.exports = prescriptionsModel;



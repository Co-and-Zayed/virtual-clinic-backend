const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionsSchema = new Schema(
  {
    patientEmail: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    doctorEmail: {
      type: String,
      required: true,
    },
    doctorName: {
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
    medicines: [
      {
        name: {
          type: String,
        },
        dosage: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        duration: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const prescriptionsModel = mongoose.model("Prescription", prescriptionsSchema);
module.exports = prescriptionsModel;

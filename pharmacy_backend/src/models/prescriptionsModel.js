const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionsSchema = new Schema(
  {
    patientUsername: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    doctorUsername: {
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
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const prescriptionsModel = mongoose.model("Prescription", prescriptionsSchema);
module.exports = prescriptionsModel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Attributes: medicineId, quantity, date, patientId
const salesSchema = new mongoose.Schema({
  medicineId: {
    type: Schema.Types.ObjectId,
    ref: "Medicine",
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  patientUsername: {
    type: String,
    required: true,
  },
});

const salesModel = mongoose.model("Sales", salesSchema);
module.exports = salesModel;

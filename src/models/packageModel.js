const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sessionDiscount: {
    type: Number, // Double for sessionDiscount
    required: true,
  },
  medicineDiscount: {
    type: Number, // Double for medicineDiscount
    required: true,
  },
  familyDiscount: {
    type: Number, // Double for familyDiscount
    required: true,
  },
});

const packageModel = mongoose.model("Package", packageSchema);
module.exports = packageModel;

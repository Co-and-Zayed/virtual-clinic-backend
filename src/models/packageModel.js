const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    type: {
        type: String,
        required : true
    },
    // price per year
    pricePerYear: {
        type: Number,
        required : true
    },
    // % discount for doctor sessions
    doctorSessionDiscount: {
        type: Number,
        required : true
    },
    // % discount for medicine
    medicineDiscount: {
        type: Number,
        required : true
    },
    // % discount for family members' subscriptions
    familyDiscount: {
        type: Number,
        required : true
    },
    
})

const packageModel = mongoose.model("Package", packageSchema);
module.exports = packageModel;
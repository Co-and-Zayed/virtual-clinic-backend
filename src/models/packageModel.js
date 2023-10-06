const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    type: {
        type: String,
        required : true
    },
    // price per year
    price_per_year: {
        type: Number,
        required : true
    },
    // % discount for doctor sessions
    doctor_session_discount: {
        type: Number,
        required : true
    },
    // % discount for medicine
    medicine_discount: {
        type: Number,
        required : true
    },
    // % discount for family members' subscriptions
    family_discount: {
        type: Number,
        required : true
    },
    
})

const packageModel = mongoose.model("Package", packageSchema);
module.exports = packageModel;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    patient: {
        type: String,
        required : true
    },
    doctor: {
        type: String,
        required : true
    },
    date : {
        type: date,
        required : true
    },
    status : {
        type : String,
        enum : ["UPCOMING", "CANCELED", "ATTENDED"] //is something is postponed, it will remain upcoming
    }
},{ timestamps: true }
)

const appointmentModel = mongoose.model("Appointment", patientSchema);
module.exports = appointmentModel;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    //patient email
    patient: {
        type: String,
        required : true
    },
    //doctor email
    doctor: {
        type: String,
        required : true
    },
    date : {
        type: Date,
        required : true
    },
    status : {
        type : String,
        enum : ["UPCOMING", "CANCELED", "ATTENDED"] //is something is postponed, it will remain upcoming
    }
},{ timestamps: true }
)

const appointmentModel = mongoose.model("Appointment", appointmentSchema);
module.exports = appointmentModel;
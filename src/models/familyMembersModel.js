const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema({
    name:{
        type: String,
        required : true
    },
    age:{
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"],
        required: true,
    },
    nationalID:{
        type: String,
        required : true
    },
    gender:{
        type: String,
        enum: ["MALE", "FEMALE"],
        required : true
    },
    age:{
        type: Number,
        required : true
    },
    relation:{
        type: String,
        enum: ["HUSBAND", "WIFE", "CHILD"],
        required : true
    },
    type:{
        type: String,
        enum: ["GUEST", "EXISTING"],
        required : true
    },
    relationTo: {
        type: String,
        required : true
    },
    healthPackage: {
        type: Schema.Types.ObjectId,
        ref: "Package",
    },
    healthPackageStatus:{
        type: String,
        enum: ["SUBSCRIBED", "UNSUBSCRIBED","CANCELLED"],
    },
    healthPackageRenewalDate:{
        type: Date,
    }
 
})

const familyMemberModel = mongoose.model("FamilyMember", familyMemberSchema);
module.exports = familyMemberModel;
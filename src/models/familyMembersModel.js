const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema({
    name:{
        type: String,
        required : true
    },
    nationalID:{
        type: String,
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
    }
})

const familyMemberModel = mongoose.model("FamilyMember", familyMemberSchema);
module.exports = familyMemberModel;
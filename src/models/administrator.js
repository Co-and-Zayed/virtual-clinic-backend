const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const familyMemberModel = mongoose.model("FamilyMember", familyMemberSchema);
module.exports = familyMemberModel;

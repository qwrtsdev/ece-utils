const { Schema, model } = require("mongoose");

const eceMembers = new Schema({
    userID: { type: String, required: true, default: null },
    nickname: { type: String, required: true, default: null },
    department: { type: String, required: true, default: null },
    instagram: { type: String, required: false, default: null },
    isVerified: { type: Boolean, required: true, default: false },
});

module.exports = model("eceMembers", eceMembers);

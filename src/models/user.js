const { Schema, model } = require('mongoose');

const eceMembers = new Schema({
    userID: { type: String, required: true },
    nickname: { type: String, required: true },
    department: { type: String, required: true },
    instagram: { type: String, required: false },
    isVerified: { type: Boolean, required: true, default: false },
});

module.exports = model('eceMembers', eceMembers);
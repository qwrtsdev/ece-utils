const { Schema, model } = require('mongoose');

const eceUser = new Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true 
    },
});
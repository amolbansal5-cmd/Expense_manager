const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    dob: {
        type: Date,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    userType: {
        type: Number,      // 0 = Admin, 1 = User
        required: true
    }

});

module.exports = mongoose.model("Employee", employeeSchema);
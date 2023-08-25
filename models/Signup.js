const mongoose = require('mongoose')

const SignupSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    pass : {
        type: String,
        required: true,
    },
    phone : {
        type: String,
        required: true,
    },
    otp : {
        type: String,
        required: true,
    },
    otpTimestamp: {
        type: Date,
    }
})


module.exports = mongoose.model('Signup', SignupSchema)
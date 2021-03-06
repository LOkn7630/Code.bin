const mongoose = require('mongoose');
var passportLocalMongoose=require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,


    Date: {
        type: Date,
        default: Date.now
    }
});
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;
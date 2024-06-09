const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
    //? Not doing this cause we are using  passport plug-in 
    // username: {
    //     type: String,
    //     required: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // }
})


//! this plug-in adds the username and password field to the schema 
userSchema.plugin(passportLocalMongoose);

module.exports = model('User', userSchema);
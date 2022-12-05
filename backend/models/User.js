//Mongoose importation
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Create user Schema
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//plugin to save an unique email adresse in database
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
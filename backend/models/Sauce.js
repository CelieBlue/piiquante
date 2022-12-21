//Mongoose Importation
const mongoose = require('mongoose');

//Create sauce Schema with the Data ModelsSauce of the project
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    usersLiked: {type: [String]},
    usersDisliked:{type: [String]},
})

module.exports = mongoose.model('Sauce', sauceSchema);
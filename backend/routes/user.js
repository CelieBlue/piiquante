//Express importation
const express = require('express');

//Password Validator importation to validate a strong password
// const password = require("../middleware/passwordValidator");

//Router function of express
const router = express.Router();

//Controllers User importation
const userCtrl = require('../controllers/user');
console.log("routes/user - userCtrl ");
console.log(userCtrl);

//Middleware for validated signup and user
const { validateUserSignUp, userValidation } = require('../middleware/check');

//endpoints for signup and login
router.post('/signup', validateUserSignUp, userValidation, userCtrl.signup);
router.post('/login', userCtrl.login);
    
//module exportation
module.exports = router;
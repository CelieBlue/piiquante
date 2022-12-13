//Express importation
const express = require('express');

//Router function of express
const router = express.Router();

//Controllers User importation
const userCtrl = require('../controllers/user');
console.log("routes/user - userCtrl ");
console.log(userCtrl);

//endpoints for signup and login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
    
//module exportation
module.exports = router;
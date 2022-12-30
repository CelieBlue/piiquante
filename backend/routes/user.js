//Express importation
const express = require('express');

//Router function of express
const router = express.Router();

//Express rate limit importation
const { signupLimiter, loginLimiter } = require('../middleware/rateLimiter');

//Controllers User importation
const userCtrl = require('../controllers/user');
console.log("routes/user - userCtrl ");
console.log(userCtrl);

//Middleware for validated signup and user
const { validateUserSignUp, userValidation } = require('../middleware/check');

//endpoints for signup and login   
router.post('/signup', signupLimiter, validateUserSignUp, userValidation, userCtrl.signup);
router.post('/login', loginLimiter, userCtrl.login);

// router.use(limiter);

    
//module exportation
module.exports = router;
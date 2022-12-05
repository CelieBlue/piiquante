//Express importation
const express = require('express');

//Router importation
const router = express.Router();


//Authentication importation
const auth = require('../middleware/auth');
//Multer config importation
const multer = require('../middleware/multer-config');

//Sauce controllers importation
const sauceCtrl = require('../controllers/sauce');
console.log("routes - sauceCtrl - appel : controllers/sauce.js");
console.log(sauceCtrl);


//endpoints for Sauces
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// router.post('/sauce/:id/like', auth, sauceCtrl.likeOneSauce);


module.exports = router;
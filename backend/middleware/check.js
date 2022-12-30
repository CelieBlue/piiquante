/*
Express Validator Importation
Verify if email and password are valid
Display the errors in the console
Password need at least 8 characters, 1 number, 1 Uppercase, 1 spcecial character
*/
const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
    check('email')
        .isEmail()
        .withMessage('Email Invalide !')
        .normalizeEmail(),
    check('password', 'Le mot de passe doit contenir au moins 8 caractères, 1 caractère spécial et 1 chiffre, 1 minusccule et une majuscule')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Entrez un mot de passe')
        .isLength({min: 8, max: 30})
        .withMessage('Le mot de passe doit contenir 8 à 30 caractères !')
        .matches(/\d/)
        .withMessage('Le mot de passe doit contenir au moins un nombre')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Le mot de passe doit contenir au moins un caractère spécial')
        .matches(/[A-Z]/)
        .withMessage('Le mot de passe doit contenir au moins une Majuscule et une minuscule')
];
   
exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array();
    if(!result.length) return next();

    const error = result[0].msg;
    console.log(error);
    res.status(401).json({success: false, message: error});
};
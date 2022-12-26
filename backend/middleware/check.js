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
        .withMessage({
            message :'Email Invalide !',
            errorCode: 1,})
        .normalizeEmail(),
    check('password', 'Le mot de passe doit contenir au moins 8 caractères, 1 caractère spécial et 1 chiffre, 1 minusccule et une majuscule')
        .trim()
        .not()
        .isEmpty()
        .withMessage({
            message : 'Entrez un mot de passe',
            errorCode: 2,})
        .isLength({min: 8, max: 30})
        .withMessage({
            message : 'Le mot de passe doit contenir 8 à 30 caractères !',
            errorCode: 3,})
        .matches(/\d/)
        .withMessage({
            message : 'Le mot de passe doit contenir au moins un nombre',
            errorCode: 4,})
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage({
            message : 'Le mot de passe doit contenir au moins un caractère spécial',
            errorCode: 5,})
        .matches(/[A-Z]/)
        .withMessage({
            message :'Le mot de passe doit contenir au moins une Majuscule et une minuscule',
            errorCode: 6}),
];
   
exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array();
    if(!result.length) return next();

    const error = result[0].msg;
    console.log(error);
    res.json({success: false, message: error});
};
//Password validator importation
const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                   // Maximum length 20
.has().uppercase()                             // Must have at least 1 uppercase letters
.has().lowercase()                             // Must have at least 1 lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

console.log("Le schema du password est " + passwordSchema);

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({error : `Veuillez saisir un mot de passe de 8 caractères minimum contenant au moins 1 Majuscule, 1 minuscule et 2 chiffres ${passwordSchema.validate('req.body.password', { list: true })})`});
    };
}
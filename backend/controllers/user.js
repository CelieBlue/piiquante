const dotenv = require('dotenv');
dotenv.config();

//bcrypt importation to crypt the password
const bcrypt = require('bcrypt');

//jsonwebtoken importation to compare the tokens
const jwt = require('jsonwebtoken');

//User's model importation
const User = require('../models/User');

//Signup function: Create a new User saved in the db with a hash
exports.signup = (req, res, next) => {
    console.log("l'email dans exports.signup est " + req.body.email);
    console.log("le password dans exports.signup est " + req.body.password);
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
 
        user.save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !"}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
    console.log("Utilisateur créé");
};

//Login function: compare the request password with the database password
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "Paire Identifiant/mot de passe invalide"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Identifiant ou mot de passe invalide" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            `${process.env.RANDOM_TOKEN_SECRET}`,
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
                console.log("Connexion réussie");
        })
        .catch(error => res.status(500).json({ error }));
        console.log("Utilisateur identifié");
 };
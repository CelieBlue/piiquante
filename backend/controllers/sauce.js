//Sauce model importation
const Sauce = require('../models/sauce');

//File System importation to create, read or delete files
const fs = require('fs');

//jsonwebtoken importation to compare the tokens
const jwt = require('jsonwebtoken');

/********** C R U D ***********/

//Create and save a sauce in the database ======================================
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req, body, sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce);

    sauce.save()
    .then(() => { req.status(201).json({ message: 'sauce enregistrée !'})})
    .catch(error => {res.status(400).json({ error: "la sauce n'est pas enregistrée" })})
};

//Read sauces ==========================================
//All sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error:"Sauces non trouvées" }));
};

//One sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error: "Cette page n'existe pas" }));
};

//Update a sauce =======================================
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
                .catch(error => res.status(401).json({ error: "Impossible de modifier la sauce" }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error: "Sauce non trouvée pour suppression" });
        });
 };

//Delete a Sauce =======================================
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: "Vous n'êtes pas autorisé à supprimer cette sauce"});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                        .catch(error => res.status(401).json({ error: "Erreur lors de la suppression de la sauce" }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error : "Sauce non trouvée pour suppression" });
        });
 };

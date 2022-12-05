//Sauce model importation
const Sauces = require('../models/sauce');

//jsonwebtoken importation to compare the tokens
const jwt = require('jsonwebtoken');

/********** C R U D ***********/

//Create and save a sauce in the database ======================================
exports.createSauce = (req, res, next) => {
    const saucesObject = JSON.parse(req, body, sauces);
    delete saucesObject._id;
    delete saucesObject._userId;
    const sauces = new Sauces({
        ...saucesObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauces.save()
    .then(() => { req.status(201).json({ message: 'sauce enregistrée !'})})
    .catch(error => {res.status(400).json({ error })})
};

//Read sauces ==========================================
//All sauces
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

//One sauce
exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({_id: req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};

//Update a sauce =======================================
exports.modifySauce = (req, res, next) => {
    const saucesObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete saucesObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((sauces) => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauces.updateOne({ _id: req.params.id}, { ...saucesObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

//Delete a Sauce =======================================
exports.deleteSauce = (req, res, next) => {
    Sauces.deleteOne(
        {_id: req.params.id}
    )
    .then(() => res.status(200).json({ message :'Sauce supprimée !'}))
    .catch(error => res.status(400).json({ error }));
};




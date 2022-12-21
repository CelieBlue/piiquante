//Sauce model importation
const Sauce = require('../models/Sauce');

//File System importation to create, read or delete files
const fs = require('fs');


/********** C R U D ***********/

//Create and save a sauce in the database ======================================
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, 
    });

    sauce
        .save()
        .then(() => {res.status(201).json({ message: "sauce enregistrée !"});
        })
        .catch((error) => {res.status(400).json({ error : "Enregistrement de la sauce impossible" });
        })
};


//Read sauces ==========================================
//All sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error : "Impossible d'afficher la liste des sauces" }));
    console.log("Sauces affichées");
};

//One sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error: "Impossible d'afficher cette sauce" }));
    console.log("Sauce affichée");
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
                res.status(401).json({ message : "Vous n'êtes pas autorisé à supprimer cette sauce"});
                console.log("Autorisation de suppression");
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : "Sauce modifiée !"}))
                .catch(error => res.status(401).json({ error: "Impossible de modifier cette sauce" }));
                console.log("Sauce modifiée");
            }
        })
        .catch(error => {
            res.status(400).json({ error: "Sauce non trouvée" });
            console.log("Supression d'une sauce");
        });
};

//Delete a Sauce =======================================
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: "Vous n'êtes pas autorisé à supprimer cette sauce"});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: "Sauce supprimée !"})})
                        .catch(error => res.status(401).json({ error: "Impossible de supprimer cette sauce" }));
                        console.log("Sauce supprimée")
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error: "Sauce non trouvée" });
            console.log("Supression d'une sauce");
        });
};

//like or dislike a sauce ==============================
/* 
The $inc operator increments a field by a specified value 
The $push and $pull operators are used to modify arrays in MongoDB documents.
- The $push operator appends values to an array
- the $pull operator removes values from an array that matches a specified condition

Likes = 1 => Push the value 1 to the sauce by the userId
Dislikes = -1 => Push the value -1 to the sauce by the userId
likes = 0 => Pull the value 1 or - 1 and reinitialized the value to 0
*/
exports.likeSauce = (req, res, next) => {
    const userWhoLike = req.auth.userId;
    let likeStatus = req.body.like;
    Sauce.findOne({_id: req.params.id})
        // .then(sauce => {
        //     if (sauce.userId == req.auth.userId) {
        //         res.status(401).json({message: "Vous n'êtes pas autorisé à liker votre sauce"});
        //     }
        .then(likedBy => {
            if (likeStatus === 1) {
                sauce.updateOne({ _id:req.params.id }, { $inc: { likes: 1}, $push: { usersLiked: userWhoLike }})
                    .then(() => res.status(201).json({ message: "J'aime cette sauce"}))
                    .catch(error => res.status(400).json({ error: "erreur lors du like de la sauce"}));
            } else if (likeStatus === -1) {
                sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userWhoLike}})
                    .then(() => res.status(201).json({ message: "Je n'aime pas cette sauce"}))
                    .catch(error => res.status(400).json({ error: "erreur lors du dislike de la sauce"}));
            } else if (likeStatus === 0) {
                if (likedBy.usersLiked.includes(userWhoLike)) {
                    sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersliked: userWhoLike}})
                        .then(() => res.status(201).json({ message: "Je n'aime plus cette sauce"}))
                        .catch(error => res.status(400).json({ error: "erreur lors de l'annulation du liked de la sauce"}));
                } else if (likedBy.usersDisliked.includes(userWhoLike)) {
                    sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userWhoLike}})
                        .then(() => res.status(201).json({ message: "Je ne déteste plus cette sauce"}))
                        .catch(error => res.status(400).json({ error: "erreur lors de l'annulation du disliked de la sauce"}));
                }
            }
        })
        .catch(error => {
            res.status(404).json({ error: "Like de la sauce échoué"});
        });
    // .catch(error => {
    //     res.status(404).json({ error: "Like de la sauce échoué"});
    // });
}

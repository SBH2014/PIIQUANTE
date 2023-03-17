
const Sauce = require('../models/sauce');
const fs = require('fs'); //expose des méthodes pour interagir avec le système de fichiers du serveur.


exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(201).json(sauce))
        .catch(error => res.status(400).json({ error }))
}


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId
    const newSauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        // pour récupèrer  le segment de base de l'URL de notre serveur
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

    });

    newSauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(newSauce => res.status(200).json(newSauce))
        .catch(error => res.status(404).json({ error }))
}
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                // permet de supprimer un fichier du système de fichiers.
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.modifySauce = (req, res, next) => {
    // si il ya un champ file dans l'objet requete , celon la requete faite avec un fichier ou pas 
    //La modification de notre route PUT est sensiblement plus compliquée, car nous devons prendre en compte deux possibilités : l'utilisateur a mis à jour l'image ou pas
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    delete sauceObject.userId; // pour evité a créer un objet a son nom et de le modifier au nom d'un autre utililisateur
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'not authorized' })
            }
            else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(res.status(200).json({ message: "Sauce modifiée" }))
                    .catch(error => res.status(400).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

exports.likeDislikeSauce = (req, res, next) => {
    //chercher l'objet dans la base de donné 
    // utilisé includes  une methode de js
    //utilisation des operateur mongoDb ($inc $push $pull)
    // 1 like =1
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log('contenu resultat promesse', sauce)

            // si le userId n'existe pas dans le tableau [userliked] (false) et like===1
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.likes == 1) {
                console.log("resultat OK : userId n' est pas dans le tableau des usersLiked dans la base de données et resultat likes = 1")
                //mise à jours base de données 
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })

                    .then(() => res.status(200).json({ message: "j'aime +1" }))
                    .catch((error) => { res.status(400).json({ error }) })
            }
            // si le userId n'existe pas dans le tableau [userliked] (false) et like===1
                // 2 like = 0
            if (sauce.usersLiked.includes(req.body.userId) && req.body.likes == 0) {
                console.log("resultat OK : userId n' est pas dans le tableau des usersLiked dans la base de données et resultat likes = 1")
                //mise à jours base de données 
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })

                    .then(() => res.status(200).json({ message: "Neutre" }))
                    .catch((error) => { res.status(400).json({ error }) })
            }
            // 3 like =-1
            // si likes = -1 dislikes= +1
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.likes == -1) {
                console.log("resultat OK : userId n' est pas dans le tableau des usersLiked dans la base de données et resultat dislikes = 1")
                //mise à jours base de données 
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })

                    .then(() => res.status(200).json({ message: "je n'aime pas " }))
                    .catch((error) => { res.status(400).json({ error }) })
            }
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.likes == 0) {
                console.log("resultat OK : userId n' est pas dans le tableau des usersdisliked dans la base de données et resultat likes = 0")
                //mise à jours base de données 
                Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })

                    .then(() => res.status(200).json({ message: "dislikes :  Neutre" }))
                    .catch((error) => { res.status(400).json({ error }) })
            }
            else {
                console.log('false')
            }

        }
        )
        .catch((error) => {
            res.status(404).json({ error })
        });



   
}







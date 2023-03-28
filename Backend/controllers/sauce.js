
const Sauce = require('../models/sauce');
const fs = require('fs'); //expose des méthodes pour interagir avec le système de fichiers du serveur.


exports.getAllSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.find()
        return res.status(201).json(sauce)
    }
    catch (error) {
        res.status(400).json({ error });
    }


}
exports.createSauce = async (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const newSauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        // pour récupèrer  le segment de base de l'URL de notre serveur
        imageUrl: getImageUrl(req),

    });
    try {
        const addNewSauce = await newSauce.save()
        return res.status(201).json({ message: 'Objet enregistré !' })
    }
    catch (error) {
        res.status(400).json({ error })
    }

};

exports.getOneSauce = async (req, res, next) => {

    try {
        const oneSauce = await Sauce.findOne({ _id: req.params.id })
        return res.status(200).json(oneSauce)
    }
    catch (error) {
        res.status(404).json({ error })
    }

}
exports.deleteSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id })
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        else {
            const filename = sauce.imageUrl.split('/images/')[1];
            // permet de supprimer un fichier du système de fichiers.
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                    .catch(error => res.status(401).json({ error }));
            });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}

exports.modifySauce = async (req, res, next) => {
    // si il ya un champ file dans l'objet requete , celon la requete faite avec un fichier ou pas 
    //La modification de notre route PUT est sensiblement plus compliquée, car nous devons prendre en compte deux possibilités : l'utilisateur a mis à jour l'image ou pas
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id })
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({ message: 'not authorized' })
        }
        else {
            try {
                const sauce = await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                return res.status(200).json({ message: "Sauce modifiée" })
            }
            catch (error) {
                res.status(400).json({ error })
            }

        }
    }
    catch (error) {
        res.status(400).json({ error })
    }
}

exports.likeDislikeSauce = async (req, res, next) => {
    //chercher l'objet dans la base de donné 
    // utilisé includes  une methode de js
    //utilisation des operateur mongoDb ($inc $push $pull)
    let sauceId = req.params.id;
    let userId = req.body.userId;
    let like = req.body.like;
    try {
        const sauce = await Sauce.findOne({ _id: sauceId });
        if (!sauce) {
            res.status(404).json({ error: 'Not found' })
        }

        let update = {};

        // si le userId n'existe pas dans le tableau [userliked] (false) et like===1
        switch (like) {
            case 1:
                // si le userId n'existe pas dans le tableau [userliked] (false) et like===1

                if (!sauce.usersLiked.includes(userId) && like === 1) {
                    console.log("resultat OK : userId n' est pas dans le tableau des usersLiked dans la base de données et resultat likes = 1")
                    //mise à jours base de données 
                    update = { $inc: { likes: 1 }, $push: { usersLiked: userId } }
                }
                break;

            case -1:

                // si likes = -1 dislikes= +1
                if (!sauce.usersDisliked.includes(userId) && like === -1) {
                    console.log("resultat OK : userId  est  dans le tableau des usersLiked dans la base de données et resultat dislikes = 1")
                    //mise à jours base de données 
                    update = { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } }

                }
                break;

            case 0:

                // 2 like = 0
                if (sauce.usersLiked.includes(userId)) {
                    console.log("resultat OK : userId  est dans le tableau des usersLiked dans la base de données et resultat likes = 0")
                    //mise à jours base de données 
                    update = { $inc: { likes: -1 }, $pull: { usersLiked: userId } }

                }

                // on enleve le dislikes 
                if (sauce.usersDisliked.includes(userId)) {
                    console.log("resultat OK : userId est dans le tableau des usersdisliked dans la base de données et resultat likes = 0")
                    //mise à jours base de données 
                    update = { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }

                }
                break;
        }
        if (update) {
            await Sauce.updateOne({ _id: sauceId }, update);
            return res.status(200).json({ message: 'ok' });
        }

        res.status(400).json({ error: 'Bad request' })
    }
    catch (error) {
        res.status(500).json({ error });
    }

}
function getImageUrl(req) {
    return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
}
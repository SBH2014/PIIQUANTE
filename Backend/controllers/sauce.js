
const Sauce = require('../models/sauce');
 //expose des méthodes pour interagir avec le système de fichiers du serveur.
const fs = require('fs');

// une personne avec un webtokenvalide accède à ces informations puisque seulement le token identifie et donne accés

exports.getAllSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.find()
        return res.status(201).json(sauce)
    }
    catch (error) {
        res.status(400).json({ error });
    }


}

exports.getOneSauce = async (req, res, next) => {

    try {
        const oneSauce = await Sauce.findById(req.params.id)
        return res.status(200).json(oneSauce)
    }
    catch (error) {
        res.status(404).json({ error })
    }

}
exports.createSauce = async (req, res, next) => {
     // on extrait le sauce de la requete via le parse
    const sauceObject = JSON.parse(req.body.sauce);
     // déclaration de sauce qui sera une nouvelle instance du modele Sauce qui contient toutes les informations dont on a besoin
    const newSauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        // pour récupèrer  le segment de base de l'URL de notre serveur
        imageUrl: getImageUrl(req),

    });
    // si problème avec valeur heat, initialisation de sa valeur (postman)
    if (newSauce.heat < 0 || newSauce.heat > 10) {
        newSauce.heat = 0;
        console.log("invalid heat value");
    }
    try {
        await newSauce.save()
        return res.status(201).json({ message: 'Objet enregistré !' })
    }

    catch (error) {
        res.status(400).json({ error })
    }

};

exports.deleteSauce = async (req, res, next) => {
    try {
        const sauce = await Sauce.findById(req.params.id)
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Not authorized' })
        }
        else {
            const filename = sauce.imageUrl.split('/images/')[1];
            // permet de supprimer un fichier du système de fichiers.
            fs.unlinkSync(`images/${filename}`)
            await Sauce.deleteOne({ _id: req.params.id })
            return res.status(200).json({ message: 'Objet supprimé !' })
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}

exports.modifySauce = async (req, res, next) => {

    // si il ya un champ file dans l'objet requete , celon la requete faite avec un fichier ou pas 
    //La modification de la route PUT est sensiblement plus compliquée, car nous devons prendre en compte deux possibilités : l'utilisateur a mis à jour l'image ou pas
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    try {
        const sauce = await Sauce.findById(req.params.id)
        if (sauce.userId != req.auth.userId) {
            return res.status(401).json({ message: 'not authorized' })
        }
        else {
            //Si changement d'image, cherche l'image de l'article et la supprime du dossier /images
            // si ImageUrl est inexistant, alors juste modification du texte, 
            const isImageUrl = sauceObject.imageUrl;;
            if (isImageUrl != undefined) {
                // on efface le fichier image qui doit se faire remplacer
                const oldImage = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldImage}`, () => { });
            }
            try {
                await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
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
    const { userId, like } = req.body
    let sauceId = req.params.id;

    try {
        const sauce = await Sauce.findById(sauceId);
        if (!sauce) {
            res.status(404).json({ error: 'Not found' })
        }
        // si like ne prend pas la valeur des likes dans le tableau [1 0 -1] (false)
        if (![1, 0, -1].includes(like)) {
            return res.status(403).json({ error: 'Like/dislike : invalid quantity' })
        }
        let update = {};
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
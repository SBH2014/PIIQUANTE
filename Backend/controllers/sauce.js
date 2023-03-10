const Sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
const sauceObject = JSON.parse(req.body.sauce);
delete sauceObject._id; 
delete sauceObject._userId // il faut pas faire confiance aux utilisateurs ous le remplaçons en base de données par le _userId extrait du token par le middleware d’authentification.
const sauce = new Sauce ({
    ...sauceObject,
    userId : req.auth.userId,
    imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

});

thing.save()
.then(() => { res.status(201).json({message: 'Objet enregistré !'})})
.catch(error => { res.status(400).json( { error })})
};

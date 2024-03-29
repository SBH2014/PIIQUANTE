//2 middleware un pour s'inscrir et un pour se connecter 
const bcrypt = require('bcrypt');
const User = require('../models/User');
const dotenv = require('dotenv')
dotenv.config()
// jsonwebtoken créé des token et les verifié 
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const {email , password} = req.body
    bcrypt.hash(password, 10)
        .then(hash => {
            //crée un nouveau user avec le mdp crypté et l'adresse mail passé dans la requete 
            const newUser = new User({
                email: email,
                password: hash
            });
            newUser.save()
                .then(() => res.status(201).json({ message: 'utilisateur crée ! ' }))
                .catch(error => res.status(400).json({ error }));
        })

        .catch( function (error) {
            console.log(error)
            res.status(500).json({ error })

    });
     

};
// connecté des utilisateurs existans 
//La méthode compare de bcrypt compare un string avec un hash , par exemple, vérifier si un mot de passe entré par l'utilisateur correspond à un hash sécurisé enregistré en base de données
exports.login = (req, res, next) => {
    const {email , password} = req.body
    User.findOne({ email})
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
       
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.TOKEN_SECRET, 
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);// verify permet de vérifier la validité d'un token (sur une requête entrante, par exemple).
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };

        if(req.body.userId && req.body.userId !== userId){
            throw new Error('unauthorized request')
        }
        next();

    } catch (error) {
        res.status(403).json({ error : error.message});
    }

};
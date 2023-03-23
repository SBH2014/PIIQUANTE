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
            return res.status(403).json({ error : 'unauthorized request'}); // todo should be 403
        }
        next();

    } catch (error) {
        res.status(401).json({ error : error.message});
    }

};

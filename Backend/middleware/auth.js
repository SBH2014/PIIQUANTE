const jwt = require('jsonwebtoken');

module.exports = (res, req, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');// verify permet de vérifier la validité d'un token (sur une requête entrante, par exemple).
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();

    } catch (error) {
        res.status(401).json({ error });
    }

};
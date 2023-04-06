const passwordSchema = require('../validation/password')

module.exports = (req , res, next)=> {
if (passwordSchema.validate(req.body.password))    {
    next()
}else {
    res.status(400).json({error : `Le mot de passe n'est pas valide ${ passwordSchema.validate('req.body.password', { list: true })}`})
}

}
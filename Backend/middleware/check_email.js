const validator = require('validator')
module.exports = (req , res, next)=> {
   const {email} = req.body;
   if (validator.isEmail(email)){
    console.log('validator email', `email ${validator.isEmail(email)}`)
    next()
}else {
    res.status(400).json({error : `l'email ${email} n'est pas valide `})
}
}
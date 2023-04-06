const mongoose = require('mongoose');
//plugin mongoose-unique-validaotr 
//s'enregistrer une fois avec une seule adresse mail 
const uniqueValidator = require('mongoose-unique-validator')
// schema de connection d'utilisateur 
const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true},// unique : true  // unique validator impossible de s'inscrir plusier fois avec le meme adresse 
    password : { type : String , required : true, } 
});
// utilisation du shema via le plugin de mongoose-unique-validator
userSchema.plugin(uniqueValidator)
//exportation de schéma model <user>
module.exports = mongoose.model('User', userSchema);
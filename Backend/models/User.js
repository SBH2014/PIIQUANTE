const mongoose = require('mongoose');
//s'enregistrer une fois avec une seule adresse mail 
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true},// unique : true  // unique validator impossible de s'inscrir plusier fois avec le meme adresse 
    password : { type : String , required : true, } 
});

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema);
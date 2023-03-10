const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email : {type : String, required : true },
    password : { type : String , required : true, unique : true} // unique : true  // unique validator impossible de s'inscrir plusier fois avec le meme adresse 
});

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema);
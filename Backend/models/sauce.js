const mongoose = require("mongoose");

const sauceShema =  mongoose.Schema({
userId  : { type : String , required : true},
name  : { type : String , required : true},
description: { type : String , required : true},
imageUrl: { type : String , required : true},
manufacturer: { type : String , required : true},
mainPepper : { type : String , required : true},
heat : { type : Number , required : true},
usersLiked : { type : [String ]},
usersDisliked : { type : [String] },
likes : { type : Number , default: 0  },
dislikes : { type : Number ,default:0 },

});
module.exports = mongoose.model('sauce', sauceShema)


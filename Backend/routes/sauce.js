const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const sauceCtrl = require('../controllers/sauce')
const Sauce = require('../models/sauce')

router.post('/', auth, multer , function(req,res){sauceCtrl.createThing} );
module.exports = router;


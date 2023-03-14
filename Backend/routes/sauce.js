const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const sauceCtrl = require('../controllers/sauce')
const Sauce = require('../models/sauce')

router.get('/' ,auth , sauceCtrl.getAllSauce);
router.post('/', auth, multer , sauceCtrl.createSauce );
router.get('/:id', sauceCtrl.getOneSauce);



module.exports = router;


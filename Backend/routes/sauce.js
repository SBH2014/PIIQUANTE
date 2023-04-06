// pour créer le router nous avons besoin d'express 
const express = require('express');
// on créer un routeur avec la méthode Router() d'express
const router = express.Router();
// middleware d'authentification pour proteger les routes 
const auth = require('../middleware/auth');
// pour ajout d'image 
const multer = require('../middleware/multer-config')
//la logique des routes 
const sauceCtrl = require('../controllers/sauce')


router.get('/' ,auth , sauceCtrl.getAllSauce);
router.post('/', auth, multer , sauceCtrl.createSauce );
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.put('/:id', auth, multer,sauceCtrl.modifySauce);
router.post('/:id/like' , auth,  sauceCtrl.likeDislikeSauce)

module.exports = router;

